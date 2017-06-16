const KoaRouter = require('koa-router');
const apiRouter = new KoaRouter({ prefix: '/api' });
const fs = require("fs");
const path = require('path');

const controllerPath = path.join(__dirname, '../controllers');

fs
  .readdirSync(controllerPath)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    let controllerClass = require(path.join(controllerPath, file));
    let controller = new controllerClass();
    for (let method of [ 'options', 'get', 'post', 'delete', 'put' ]) {
      if (method in controller) {
        apiRouter[method](controller.url, async (ctx, next) => {
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
