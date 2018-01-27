import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import css from './rollup-plugins/rollup-plugin-css'

const IS_PROD = process.env.NODE_ENV === 'production'

const baseConfig = {
  plugins: [
    css({
      output: './public/build/s.css',
      minify: IS_PROD
    }),
    json(),
    buble({ jsx: 'h' }),
    nodeResolve({ jsnext: true, main: true }),
    commonjs(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') })
  ]
}

if (IS_PROD) {
  baseConfig.plugins.push(uglify())
}

const getConfig = (opts) =>
  Object.assign({}, baseConfig, opts)

const hasNoFileExtension = /^(?!.*\.\w{1,7}$)/
export default [
  getConfig({
    input: 'src/worker',
    output: {
      format: 'iife',
      file: 'public/build/worker.js' 
    } 
  }),
  getConfig({
    input: 'src/main',
    output: {
      format: 'iife',
      file: 'public/build/main.js' 
    } 
  })
]
