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

koa.keys = ['i-love-piper']
koa.use(require('koa-session')({}, koa))

koa.use(require('koa-bodyparser')());
koa.use(require('./lib/errorlog'));

// authentication
require('./lib/passport')
const passport = require('koa-passport')
koa.use(passport.initialize())
koa.use(passport.session())

const router = require('koa-router')()

router.get('/auth/github',
  passport.authenticate('github')
)

router.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

koa.use(router.routes())

koa.use(require('./lib/api'));
koa.use(require('koa-static')('dist'));

// Require authentication for now
koa.use(function(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    if (ctx.request.url.indexOf('/api/') !== -1) {
      throw {
        status: 401,
        name: 'NOT_LOGIN',
        message: 'not login'
      }
    } else {
      ctx.redirect('/')
    }
  }
})

module.exports = koa;
