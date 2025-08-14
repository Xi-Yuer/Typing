import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

const config = [
  // JavaScript build
  {
    input: 'index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
    ],
    external: [],
  },
  // TypeScript declarations
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];

export default config;