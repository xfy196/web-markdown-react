import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import postcss from "rollup-plugin-postcss"
import nodePolyfills from "rollup-plugin-node-polyfills"
import typescript from "rollup-plugin-typescript2"

export default {
    input: "./src/index.ts",
    output: {
        file: "./lib/bundle.js",
        format: "esm"
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
        }),
        commonjs(),
        postcss({
            plugins: [
                require('autoprefixer')({ overrideBrowserslist: ['> 0.15% in CN'] })
            ]
        }),
        typescript(),
        nodePolyfills()
    ],
    external: ['react']
}