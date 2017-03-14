const koa = new (require('koa'))();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  // for dev
  const webpackConfig = require('../build/webpack.dev.conf');
  const convert = require('koa-convert')
  const webpack = require('webpack')
  var compiler = webpack(webpackConfig)
  const webpackDevMiddleware = require("koa-webpack-dev-middleware")
  const webpackHotMiddleware = require("koa-webpack-hot-middleware")

  var devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  })

  var hotMiddleware = webpackHotMiddleware(compiler, {
    log: () => {}
  })
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  koa.use(convert(devMiddleware))
  koa.use(convert(hotMiddleware))

  // for dev log
  koa.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
}

koa.use(require('koa-bodyparser')());
koa.use(require('./lib/errorlog'));
koa.use(require('./lib/api'));
koa.use(require('koa-static')('../dist'));
koa.use(require('koa-static')('public'));

module.exports = koa;
