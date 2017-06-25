import Koa from 'koa';
import Router from 'koa-router';
import staticServe from 'koa-static';
import mount from 'koa-mount';
import { PORT, FONTS_DIRNAME, FONTS_ROOT } from './constants';
import css from './css';
import { loadCache } from './fonts';

const app = new Koa();
const router = Router();
// TODO: Update `koa-static` when it updates its dependency on `koa-send` to
// version 4. That way we can use `brotli` compression. Currently, the option
// below doesn't do anything.
const serve = mount(`/${FONTS_DIRNAME}`, staticServe(FONTS_ROOT, { gzip: true, brotli: true }));

router
  .get('/css', async (ctx) => {
    ctx.type = 'text/css; charset=utf-8';
    try {
      // Find the best encoding to use
      const acceptedEncodings = ctx.acceptsEncodings();
      let encoding;
      if (acceptedEncodings.indexOf('identity') > -1) encoding = 'identity';
      if (acceptedEncodings.indexOf('deflate') > -1) encoding = 'deflate';
      if (acceptedEncodings.indexOf('gzip') > -1) encoding = 'gzip';
      if (acceptedEncodings.indexOf('br') > -1) encoding = 'br';
      ctx.set('Content-Encoding', encoding);

      // Send response
      ctx.body = await css(ctx.request.querystring, encoding);
    } catch (err) {
      // Send error
      ctx.status = 500;
      ctx.body = err.message;
    }
  })
  .get(`/${FONTS_DIRNAME}/*`, async (ctx, ...args) => {
    // Set CORS for browsers to access font files
    ctx.set('Access-Control-Allow-Origin', '*');
    return serve(ctx, ...args);
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

(async () => {
  await loadCache();
  app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`), // eslint-disable-line no-console
  );
})();
