import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { dependencies } from './package.json';

export default {
  banner: '/* eslint-disable */',
  entry: './src/index.js',
  format: 'cjs',
  dest: './dist/index.js',
  external: Object.keys(dependencies).concat(['simple-git/promise', 'path', 'zlib']),
  plugins: [
    nodeResolve(),
    babel({
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              node: 'current',
            },
          },
        ],
        'stage-0',
      ],
      plugins: [
        'external-helpers',
      ],
    }),
  ],
};
