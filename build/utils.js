'use strict'
const path = require('path')
const config = require('./config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const _ = module.exports = {}

_.outputPath = path.join(__dirname, '../dist')

_.publicPath = path.join(__dirname, '../public')

_.outputIndexPath = path.join(__dirname, '../dist/index.html')

_.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  const generateLoaders = function (loaders) {
    let sourceLoader = loaders.map(function (loader) {
      let extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      //return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
      return ExtractTextPlugin.extract({ fallbackLoader: 'vue-style-loader', loader: sourceLoader })
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(options.px2rem ? ['css', 'px2rem', 'less'] : ['css', 'less'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
_.styleLoaders = function (options) {
  let output = []
  let loaders = _.cssLoaders(options)
  for (const extension in loaders) {
    let loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

_.target = 'web'
