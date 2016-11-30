'use strict'
const pkg = require('../package')

module.exports = {
  port: 4000,
  title: 'piper',
  vendor: Object.keys(pkg.dependencies),
  babel: {
    babelrc: false,
    presets: [
      ['es2015', {modules: false}],
      'stage-1'
    ]
  },
  postcss: [
    require('autoprefixer')({
      // Vue does not support ie 8 and below
      browsers: ['last 2 versions', 'ie > 8']
    })
  ],
  cssSourceMap: false
}
