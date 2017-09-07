import pageApi from './page'
import models from '../models'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import upload from '../lib/publish'
import webshot from 'webshot'

const protocol = 'http://'

export default class {
  constructor() {
    this.url = '/publish/:id';
  }

  async put(ctx) {
    // save data first
    await new pageApi().put(ctx)

    let { id } = ctx.params;

    let [page] = await models.pages.findAll({
      where: {
        is_delete: 0,
        id: id
      }
    });

    if (!page) throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };

    await models.pages.update({
      is_publish: 1,
      publish_at: Date.now()
    }, {
      where: {
        id: id
      }
    })

    await models.changelog.create({
      action: 4,
      page_id: id,
      items: null,
      create_by: ctx.state.user.id
    });

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

    let shotUrl = `http://127.0.0.1:3000/view/${id}`
    
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

    webshot(shotUrl, `${dir}/cover.png`, options, function(err) {
      if(err) {
        throw { status: 404, name: 'WEBSHOT_ERR', message: 'webshot failed' };
      }

      upload([fs.createReadStream(`${dir}/cover.png`)]).then((coverRes) => {
        models.pages.update({
          cover: protocol + coverRes[0].url
        }, {
          where: {
            id: id
          }
        })
      })
    });

    ctx.body = {
      url: shotUrl
    }
  }

}
