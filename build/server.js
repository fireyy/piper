'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')
const request = require('request')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev')
const config = require('./config')

const app = express()

const port = config.port

// Object.keys(webpackConfig.entry).forEach(function (name) {
//   webpackConfig.entry[name] = [`webpack-hot-middleware/client`].concat(webpackConfig.entry[name])
// })

const compiler = webpack(webpackConfig)

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
})
app.use(devMiddleWare)
app.use(require('webpack-hot-middleware')(compiler))

var mockPath = path.join(__dirname, '../mock')

app.use('/api', function(req, res){
  console.log(req.path)
  var data = fs.readFileSync(path.join(mockPath, req.path), "utf8")
  console.log(data)
  res.json(JSON.parse(data))
})

var chuckNorrisApiProxy = proxy(['/upload'], {
  target: "http://zhaoshang.sit.ffan.com/",
  changeOrigin: true,
  logLevel: 'debug',
  headers: {
    Cookie: "PHPSESSID=94i22svhvhv89iipkkivfvls13"
  }
});
app.use(chuckNorrisApiProxy)

const mfs = devMiddleWare.fileSystem
const file = path.join(webpackConfig.output.path, 'index.html')
app.get('*', (req, res) => {
  devMiddleWare.waitUntilValid(() => {
    const html = mfs.readFileSync(file)
    res.end(html)
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
