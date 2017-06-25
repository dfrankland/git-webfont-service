import { resolve as resolvePath } from 'path';
import Ajv from 'ajv';
import schema from './fonts/schema';
import defaultSettings from './fonts/defaultSettings';

export const PORT = process.env.PORT || 3000;
export const MAX_AGE = process.env.MAX_AGE || 86400000; // 1 day in ms

export const FONTS_DIRNAME = process.env.FONTS_DIRNAME || 'fonts';
export const FONTS_ROOT = resolvePath(
  __dirname,
  process.env.FONTS_ROOT || './',
  `./${FONTS_DIRNAME}`,
);

if (process.env.FONTS_SETTINGS) {
  let fontSettings;
  try {
    /* eslint-disable global-require, import/no-dynamic-require */
    fontSettings = require(process.env.FONTS_SETTINGS);
    /* eslint-enable */
  } catch (err) {
    throw new Error(`
      Could not \`require\` your \`FONTS_SETTINGS\` from \`${process.env.FONTS_SETTINGS}\`!
      ${err.message}
    `);
  }

  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  if (!validate(fontSettings)) {
    throw new Error('Your `FONTS_SETTINGS` are not valid!');
  }
}

// TODO: Remove this log
const ajv = new Ajv();
const validate = ajv.compile(schema);
console.log('Are the default settings valid?', validate(defaultSettings));

export const FONTS_SETTINGS = process.env.FONTS_SETTINGS || defaultSettings;
