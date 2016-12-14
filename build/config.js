'use strict'
const pkg = require('../package')
const _ = require('./utils')

module.exports = {
  port: 4000,
  title: '营销活动制作平台',
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
    loaders: _.cssLoaders(),
    preserveWhitespace: false,
    postcss: [
      require('autoprefixer')({
        browsers: ['last 3 versions']
      }),
      require('postcss-pxtorem')({
        root_value: '20', // 基准值 html{ font-zise: 20px; }
        prop_white_list: [], // 对所有 px 值生效
        minPixelValue: 2 // 忽略 1px 值
      })
    ],
    buble: {
      objectAssign: 'Object.assign'
    }
  },
  cssSourceMap: false
}
