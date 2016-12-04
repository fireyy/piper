const koa = new (require('koa'))();

const webpackConfig = require('../build/webpack.dev');
const convert = require('koa-convert')
const webpack = require('webpack')
const compiler = webpack(webpackConfig)
const webpackDevMiddleware = require("koa-webpack-dev-middleware")
const webpackHotMiddleware = require("koa-webpack-hot-middleware")

// for dev
koa.use(convert(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
})))
koa.use(convert(webpackHotMiddleware(compiler)))

// for dev log
koa.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

koa.use(require('koa-bodyparser')());
koa.use(require('./lib/errorlog'));
koa.use(require('./lib/api'));
//koa.use(require('koa-static')('../dist'));

export default koa;
