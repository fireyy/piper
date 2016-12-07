'use strict'
const path = require('path')
const exec = require('child_process').execSync
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const base = require('./webpack.base')
const pkg = require('../package')
const _ = require('./utils')
const config = require('./config')

// remove dist folder in web app mode
//exec('rm -rf dist/')
// use source-map in web app mode
base.devtool = 'source-map'

// a white list to add dependencies to vendor chunk
base.entry = {
  'preview': './src/preview.js',
  'vendor': ['vue']
}
// use hash filename to support long-term caching
base.output.publicPath = './'
// base.output.filename = '[name].[hash:8].js'
base.output.filename = '[name].[chunkhash:8].js'
// add webpack plugins
base.plugins = [
  new ProgressBarPlugin(),
  new LodashModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  })
];

module.exports = function(env) {
  let dir = path.join(__dirname, '../public/' + env.id)
  base.output.path = dir
  base.plugins.push(
    new HtmlWebpackPlugin({
      template: dir + `/index.html`
    }),
    // extract vendor chunks
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
  )
  return base
}

// module.exports = base
