'use strict'
const webpack = require('webpack')
const base = require('./webpack.base')
const config = require('./config')
const _ = require('./utils')

base.devtool = 'eval-source-map'

Object.keys(base.entry).forEach(function (name) {
  base.entry[name] = [`webpack-hot-middleware/client`].concat(base.entry[name])
})

base.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
)

module.exports = base
