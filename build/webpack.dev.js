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

module.exports = base
