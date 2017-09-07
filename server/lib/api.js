import KoaRouter from 'koa-router'
import fs from 'fs'
import path from 'path'

import changelogs from '../controllers/changelogs'
import count from '../controllers/count'
import files from '../controllers/files'
import page from '../controllers/page'
import pages from '../controllers/pages'
import publish from '../controllers/publish'
import users from '../controllers/users'

const apiRouter = new KoaRouter({ prefix: '/api' });

[changelogs, count, files, page, pages, users].forEach(function(klass) {
  let controller = new klass();
  for (let method of [ 'options', 'get', 'post', 'delete', 'put' ]) {
    if (method in controller) {
      apiRouter[method](controller.url, async (ctx) => {
        if (ctx.isAuthenticated()) {
          return await controller[method](ctx)
        } else {
          throw {
            status: 401,
            name: 'NOT_LOGIN',
            message: 'not login'
          }
        }
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

export default apiRouter
