import LruCache from 'lru-cache';
import Ajv from 'ajv';
import qs from 'qs';
import cssnano from 'cssnano';
import { gzip } from 'zlib';
import { MAX_AGE } from '../constants';
import schema from './schema';
import template from './template';
import fonts from '../fonts';

const cache = new LruCache({ maxAge: MAX_AGE, stale: true });
const ajv = new Ajv();
const validate = ajv.compile(schema);

const compress = string => (
  new Promise(
    (resolve, reject) => (
      gzip(Buffer.from(string), (err, result) => (err ? reject(err) : resolve(result)))
    ),
  )
);

export default async (querystring) => {
  const cachedResponse = cache.get(querystring);
  if (cachedResponse) return cachedResponse;

  const query = qs.parse(querystring);

  if (!validate(query)) throw new Error('/* Font query was invalid! */');

  const css = query.fonts.reduce(
    (fontsCss, { family, weights } = {}) => `
      ${fontsCss}
      ${weights.reduce(
        (weightsCss, weightString) => {
          let weight = weightString;

          const italic = weight[weight.length - 1] === 'i';

          if (italic) weight = weight.slice(0, weight.length - 1);

          const urls = fonts({ family, weight: weightString });

          if (urls.length === 0) return weightsCss;

          return `
            ${weightsCss}
            ${template({ family, italic, weight, urls })}
          `;
        },
        '',
      )}
    `,
    '',
  );

  try {
    const response = await compress(
      (
        await cssnano.process(css, {}, { discardUnused: { fontFace: false } })
      ).css,
    );
    cache.set(querystring, response);
    return response;
  } catch (err) {
    throw new Error('/* Could not optimize CSS! */');
  }
};
