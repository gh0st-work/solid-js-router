
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "es"
    }
  ],
  external: ["solid-js", "solid-js/web"],
  plugins: [
    nodeResolve({
      extensions: [".js", ".jsx"],
    }),
    babel({
      extensions: [".js", ".jsx"],
      babelHelpers: "bundled",
      presets: ["solid"],
      exclude: "node_modules/**"
    })
  ]
};