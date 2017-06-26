import LruCache from 'lru-cache';
import git from 'simple-git/promise';
import { resolve as resolvePath } from 'path';
import { remove as removeDir, ensureDir, writeFile } from 'fs-extra';
import stringify from 'json-stable-stringify';
import { MAX_AGE, FONTS_DIRNAME, FONTS_ROOT, FONTS_SETTINGS } from '../constants';
import compress from '../lib/compress';

const downloadFontWeight = (fontName, weight, cache) => {
  const fontPath = resolvePath(FONTS_ROOT, fontName);
  return Promise.all(
    Object.keys(FONTS_SETTINGS[fontName].weights[weight]).map(
      async format => {
        const repoPathToFile = FONTS_SETTINGS[fontName].weights[weight][format];
        const fileName = `${weight}.${format}`;

        const file = await git(fontPath).binaryCatFile([
          '-p',
          `HEAD:${repoPathToFile}`,
        ]);

        await writeFile(resolvePath(fontPath, fileName), file);
        await writeFile(
          resolvePath(fontPath, `${fileName}.gz`),
          await compress(file, 'gzip'),
        );
        await writeFile(
          resolvePath(fontPath, `${fileName}.br`),
          await compress(file, 'br'),
        );

        const key = stringify({ family: fontName, weight });
        console.log('Key', key, 'added:', fileName);
        const oldUrls = cache.get(key) || {};
        cache.set(
          key,
          {
            ...oldUrls,
            [format]: `/${FONTS_DIRNAME}/${fontName}/${fileName}`,
          },
        );
      },
    ),
  );
};

const downloadFont = async (fontName, cache) => {
  const fontPath = resolvePath(FONTS_ROOT, fontName);
  await git(fontPath).fetch();
  await Promise.all(
    Object.keys(FONTS_SETTINGS[fontName].weights).map(
      weight => downloadFontWeight(fontName, weight, cache),
    ),
  );
};

const cache = new LruCache({
  maxAge: MAX_AGE,
  stale: true,
  noDisposeOnSet: true,
  dispose: async key => {
    console.log('Key', key, 'disposed.');
    const { family: fontName, weight } = JSON.parse(key);
    await downloadFontWeight(fontName, weight, cache);
  },
});

export const loadCache = async () => {
  // Re-create font directory
  await removeDir(FONTS_ROOT);
  await ensureDir(FONTS_ROOT);

  await Promise.all(
    Object.keys(FONTS_SETTINGS).map(
      async fontName => {
        // Make directories for all specified fonts
        const repoPath = resolvePath(FONTS_ROOT, fontName, './.git');
        await ensureDir(repoPath);
        await git(repoPath).clone(FONTS_SETTINGS[fontName].url, repoPath, ['--bare']);
        await downloadFont(fontName, cache);
      },
    ),
  );
};

export default ({ family, weight }) => (
  cache.get(stringify({ family, weight }))
);
