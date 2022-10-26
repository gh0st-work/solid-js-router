import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import withSolid from 'rollup-preset-solid';

const ext = ['.js', '.jsx', '.ts', '.tsx']

export default withSolid({
  input: "src/index.ts",
  output: [
    {
      dir: './dist/esm',
      format: 'esm',
      sourcemap: 'inline',
      minifyInternalExports: true,
    },
    {
      dir: './dist/cjs',
      format: 'cjs',
      sourcemap: 'inline',
      minifyInternalExports: true,
    },
  ],
  external: ["solid-js", "solid-js/web"],
  plugins: [
    nodeResolve({
      extensions: ext,
    }),
    babel({
      extensions: ext,
      babelHelpers: "bundled",
      presets: ['solid', '@babel/preset-typescript'],
      exclude: "node_modules/**"
    }),
    terser(),
  ]
});