'use strict'
const pkg = require('../package')

module.exports = {
  port: 4000,
  title: 'piper',
  vendor: Object.keys(pkg.dependencies),
  babel: {
    babelrc: false,
    plugins: ['lodash'],
    presets: [
      ['es2015', {modules: false}],
      'stage-1'
    ]
  },
  vue: {
    preserveWhitespace: false,
    postcss: [
      require('autoprefixer')({
        browsers: ['last 3 versions']
      })
    ],
    buble: {
      objectAssign: 'Object.assign'
    }
  },
  cssSourceMap: false
}
