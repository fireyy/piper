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
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      'vue': 'vue/dist/vue.common.js',
      'src': path.join(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: config.vue
      },
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules/,
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!px2rem-loader?remUnit=75&remPrecision=8!less-loader'
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
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
  ]
}
