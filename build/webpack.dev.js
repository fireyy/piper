'use strict'
const webpack = require('webpack')
const base = require('./webpack.base')
const config = require('./config')
const _ = require('./utils')

base.devtool = 'eval-source-map'
base.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
)

// push loader for .css file
base.module.loaders.push(
  _.styleLoaders({ sourceMap: config.cssSourceMap })
)

module.exports = base
