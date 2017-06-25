import LruCache from 'lru-cache';
import git from 'simple-git/promise';
import { resolve as resolvePath } from 'path';
import { remove as removeDir, ensureDir, writeFile } from 'fs-extra';
import { MAX_AGE, FONTS_DIRNAME, FONTS_ROOT, FONTS_SETTINGS } from '../constants';

const cache = new LruCache({ maxAge: MAX_AGE, stale: true });

export const loadCache = async () => {
  // Re-create font directory
  await removeDir(FONTS_ROOT);
  await ensureDir(FONTS_ROOT);

  await Promise.all(
    Object.keys(FONTS_SETTINGS).map(
      async fontName => {
        // Make directories for all specified fonts
        const fontPath = resolvePath(FONTS_ROOT, fontName);
        const repoPath = resolvePath(fontPath, './repo');
        await ensureDir(repoPath);
        await git(repoPath).clone(FONTS_SETTINGS[fontName].url, repoPath);

        await Promise.all(
          Object.keys(FONTS_SETTINGS[fontName].weights).map(
            weight => (
              Promise.all(
                Object.keys(FONTS_SETTINGS[fontName].weights[weight]).map(
                  async format => {
                    const repoPathToFile = FONTS_SETTINGS[fontName].weights[weight][format];
                    const fileName = `${weight}.${format}`;

                    const file = await git(repoPath).binaryCatFile([
                      '-p',
                      `HEAD:${repoPathToFile}`,
                    ]);

                    await writeFile(resolvePath(fontPath, fileName), file);

                    const key = JSON.stringify({ family: fontName, weight });
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
              )
            ),
          ),
        );
      },
    ),
  );
};

export default ({ family, weight }) => (
  cache.get(JSON.stringify({ family, weight }))
);