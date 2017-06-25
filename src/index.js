import Koa from 'koa';
import Router from 'koa-router';
import staticServe from 'koa-static';
import mount from 'koa-mount';
import { PORT, FONTS_DIRNAME, FONTS_ROOT } from './constants';
import css from './css';
import { loadCache } from './fonts';

const app = new Koa();
const router = Router();
const serve = mount(`/${FONTS_DIRNAME}`, staticServe(FONTS_ROOT, { gzip: true }));

router
  .get('/css', async (ctx) => {
    ctx.type = 'text/css; charset=utf-8';
    try {
      const response = await css(ctx.request.querystring);
      ctx.set('Content-Encoding', 'gzip');
      ctx.body = response;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
    }
  })
  .get(`/${FONTS_DIRNAME}/*`, async (ctx, ...args) => {
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
