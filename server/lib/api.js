const KoaRouter = require('koa-router');
const apiRouter = new KoaRouter({ prefix: '/api' });
const glob = require('glob');
const path = require('path');
const database = require('./database');

glob.sync(path.join(__dirname, '../controllers/*.js')).forEach(dep => {
  let controller = require(dep);
  for (let method of [ 'options', 'get', 'post', 'delete', 'put' ]) {
    if (method in controller) {
      apiRouter[method](controller.url, database, async (ctx, next) => {
        return controller[method](ctx).then(next);
      });
    }
  }
});

apiRouter.get('/logout', (ctx) => {
  ctx.logout()
  ctx.body = {
    message: 'success'
  }
})

module.exports = apiRouter.routes();
