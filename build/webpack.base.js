'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')
const _ = require('./utils')

module.exports = {
  entry: {
    'app': './src/app.js',
    'preview': './src/preview.js'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.css', '.json'],
    alias: {
      src: path.join(__dirname, '../src')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loaders: ['vue']
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: [/node_modules/]
      },
      {
        test: /\.es6$/,
        loaders: ['babel']
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  babel: config.babel,
  postcss: config.postcss,
  vue: {
    loaders: _.cssLoaders(),
    postcss: config.postcss
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: __dirname + '/index.html',
      chunks  : ['app'],
      filename: _.outputPath + '/index.html'
    }),
    new HtmlWebpackPlugin({
      title: config.title,
      template: __dirname + '/preview.html',
      chunks  : ['preview'],
      filename: _.outputPath + '/preview.html'
    })
  ],
  target: _.target
}
