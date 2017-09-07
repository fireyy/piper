import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import apiRoute from './lib/api'
import models from './models'

const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.keys = ['i-love-piper']
app.use(require('koa-session')({}, app))

app.use(require('koa-bodyparser')());
// app.use(require('./lib/errorlog'));

// authentication
require('./lib/passport')
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

const router = require('koa-router')()

router.get('/auth/github',
  passport.authenticate('github')
)

router.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    // TODO: login failure page
    failureRedirect: '/login'
  })
)

app.use(router.routes())
app.use(apiRoute.routes())

app.use(ctx => {
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset

  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve)
    ctx.res.on('finish', resolve)
    nuxt.render(ctx.req, ctx.res, promise => {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject)
    })
  })
})

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

// Instantiate nuxt.js
const nuxt = new Nuxt(config)

// Build in development
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build().catch(e => {
    console.error(e) // eslint-disable-line no-console
    process.exit(1)
  })
}

models.sequelize.sync().then(function(){
  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}).catch(function(err){
  console.error(new Error(err))
});
