const pageApi = require('./page');

const path = require('path');
const views = require('co-views');
const child_process = require('child_process');
const fs = require('fs');
const mkdirp = require('mkdirp');
const render = views(path.join(__dirname, '../views'), { ext: 'ejs' });
const upload = require('../lib/publish');

const webshot = require('webshot');

const protocol = 'http://'

module.exports = class {
  static url = '/publish/:id';

  static async get(ctx) {
    let { id } = ctx.params;
    let result = await ctx.sql('                                                              \
      SELECT `id`, `title`, `config`, `items`, `create_by`, `create_at`              \
        FROM `pages` WHERE `id` = ? AND `is_delete` = 0                                       \
    ', [ id ]);
    let page = result[0];
    if (!page) throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };
    try { page.items = JSON.parse(page.items); } catch(error) {
      throw { status: 500, name: 'JSON_PARSE_ERROR', message: 'json parse error' }
    };

    let html = await render('activity', { page: page });

    ctx.body = html
  }

  static async put(ctx) {
    // save data first
    await pageApi.put(ctx)

    let { id } = ctx.params;
    let page;
    await ctx.sql.commit(async () => {
      let [record] = await ctx.sql('\
        SELECT `id`, `title`, `config`, `items`, `create_by`, `create_at`              \
          FROM `pages` WHERE `id` = ? AND `is_delete` = 0                              \
      ', [ id ]);
      if (!record) throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };

      if (record.is_publish == 0) await ctx.sql('UPDATE `pages` SET ? WHERE `id` = ?', [ {'is_publish': 1}, id ]);
      await ctx.sql(
        'INSERT INTO `changelog` (`action`, `page_id`, `items`, `create_by`) VALUES (?)',
        [ [ 4, id, null, ctx.user.id ] ]
      );
      page = record;
    })

    const dir = `public/${id}`;

    if (!fs.existsSync(dir)) {

      mkdirp(dir, function (err) {
        if (err) {
          console.error(err)
        }
      });
    }

    try {
      page.config = JSON.parse(page.config);
      page.items = JSON.parse(page.items);
    } catch(error) {
      throw { status: 500, name: 'JSON_PARSE_ERROR', message: 'json parse error' }
    };

    let html = await render('activity', { page: page });

    await fs.writeFileSync(dir + `/index.html`, html, 'utf-8', {'flags': 'w+'});

    const command = `NODE_ENV=production webpack --config ./build/webpack.publish.conf.js --env.id=${id} --hide-modules --json --verbose`;

    const stdout = child_process.execSync(command).toString();

    let packRes = JSON.parse(stdout);

    if (packRes.errors.length == 0) {
      let files = packRes.assets.map(item => {
        return fs.createReadStream(dir + `/${item.name}`)
      })
      let uploadRes = await upload(files);

      let shotUrl = uploadRes.filter(item => {
        return item.url.indexOf('index.html') !== -1
      })
      shotUrl[0].url = protocol + shotUrl[0].url

      var options = {
        screenSize: {
          width: 375
        , height: 375
        }
      , shotSize: {
          width: 375
        , height: 'all'
        }
      , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
          + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
      };

      webshot(shotUrl[0].url, `${dir}/cover.png`, options, function(err) {
        if(err) {
          throw { status: 404, name: 'WEBSHOT_ERR', message: 'webshot failed' };
        }

        (async function(){
          let coverRes = await upload([fs.createReadStream(`${dir}/cover.png`)]);
          ctx.sql('UPDATE `pages` SET ? WHERE `id` = ?', [ {
            cover: protocol + coverRes[0].url
          }, id ]);
        })()
      });

      ctx.body = shotUrl
    } else {

      ctx.body = packRes;
    }

  }

}
