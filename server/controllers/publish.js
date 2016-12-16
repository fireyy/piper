const authorize = require('../lib/authorize');

const path = require('path');
const views = require('co-views');
const child_process = require('child_process');
const fs = require('fs');
const mkdirp = require('mkdirp');
const render = views(path.join(__dirname, '../views'), { ext: 'ejs' });
const upload = require('../lib/upload');

module.exports = class {
  static url = '/publish/:id';

  @authorize([ 'EDIT' ])
  static async get(ctx) {
    let { id } = ctx.params;
    let result = await ctx.sql('                                                              \
      SELECT `id`, `path`, `title`, `comment`, `items`, `create_by`, `create_at`              \
        FROM `pages` WHERE `id` = ? AND `is_delete` = 0                                       \
    ', [ id ]);
    let page = result[0];
    if (!page) throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };
    try { page.items = JSON.parse(page.items); } catch(error) {
      throw { status: 500, name: 'JSON_PARSE_ERROR', message: 'json parse error' }
    };
    ctx.body = await render('activity', { page: page });
  }

  @authorize([ 'EDIT' ])
  static async put(ctx) {
    let { id } = ctx.params;
    let result = await ctx.sql('                                                              \
      SELECT `id`, `path`, `title`, `comment`, `items`, `create_by`, `create_at`              \
        FROM `pages` WHERE `id` = ? AND `is_delete` = 0                                       \
    ', [ id ]);
    let page = result[0];
    if (!page) throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };

    const dir = `public/${id}`;

    if (!fs.existsSync(dir)) {

      mkdirp(dir, function (err) {
        if (err) {
          console.error(err)
        }
      });
    }

    try { page.items = JSON.parse(page.items); } catch(error) {
      throw { status: 500, name: 'JSON_PARSE_ERROR', message: 'json parse error' }
    };

    let html = await render('activity', { page: page });

    await fs.writeFileSync(dir + `/index.html`, html, 'utf-8', {'flags': 'w+'});

    const command = `NODE_ENV=production webpack --config ./build/webpack.publish.js --env.id=${id} --hide-modules --json`;

    const stdout = child_process.execSync(command);

    let packRes = JSON.parse(stdout);

    if (packRes.errors.length == 0) {
      let files = packRes.assets.map(item => {
        return fs.createReadStream(dir + `/${item.name}`)
      })
      let uploadRes = await upload(files);

      ctx.body = uploadRes
    } else {

      ctx.body = packRes;
    }

  }

}
