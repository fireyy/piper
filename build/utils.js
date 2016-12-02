'use strict'
const path = require('path')
const config = require('./config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const _ = module.exports = {}

_.outputPath = path.join(__dirname, '../dist')

_.outputIndexPath = path.join(__dirname, '../dist/index.html')

_.target = 'web'
