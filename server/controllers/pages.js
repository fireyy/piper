const models = require('../models');
const __ = require('../constants');

module.exports = class {
  constructor() {
    this.url = '/pages';
  }

  async get(ctx) {
    let { page, size, title, isPublish } = ctx.query;
    page = parseInt(page, 10)
    size = parseInt(size, 10)
    let start = (page - 1) * size;
    let limit = size;
    let where = {
      is_delete: 0
    };
    if (title) {
      where['title'] = {
        $like: `%${title}%`
      }
    }
    if (isPublish != -1) {
      where['is_publish'] = isPublish
    }
    let result = await models.pages.findAndCountAll({
      include: [
        {
          model: models.users,
          attributes: ['name']
        }
      ],
      offset: start,
      limit: limit,
      where: where,
      order: [['create_at', 'DESC']]
    });

    ctx.body = {
      total: result.count,
      page: page,
      size: size,
      data: result.rows
    };
  }

  async put(ctx) {
    let { title = '', config = '', items = '' } = ctx.request.body;
    title = title.trim();
    if (!title) throw { status: 400, name: 'ERROR_PARAMS', message: 'Title 不能为空' };
    items = JSON.stringify(items);
    if (items.length > __.VALUE_MAX_LENGTH) throw __.VALUE_TOO_LONG;
    config = JSON.stringify(config);

    let [page, created] = await models.pages.findOrCreate({
      where: {
        is_delete: 0,
        title: title
      },
      defaults: {
        title: title,
        config: config,
        items: items,
        create_by: ctx.state.user.id
      }
    });

    if (page && !created) {
      throw { status: 400, name: 'DUP', message: '记录已存在' };
    }

    await models.changelog.create({
      action: 1,
      page_id: page.id,
      items: items,
      create_by: ctx.state.user.id
    })

    ctx.body = {
      message: 'Save success',
      item: page
    };
  }

};
