import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default [
  {
    input: pkg.module,
    output: [
      { file: pkg.main, format: 'es', sourcemap: true },
    ],
    external: [
      'debug',
      'stream',
    ],
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(),
      eslint(),
      babel({
        exclude: 'node_modules/**',
        envName: 'rollup',
        babelHelpers: 'bundled',
      }),
    ],
  },
];
