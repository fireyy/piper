const models = require('../models');

module.exports = class {
  constructor() {
    this.url = '/changelogs';
  }

  async get(ctx) {
    let { page, size, title, action } = ctx.query;
    page = parseInt(page, 10)
    size = parseInt(size, 10)
    let start = (page - 1) * size;
    let limit = size;
    let where = {};
    if (title) {
      where['$page.title$'] = {
        $like: `%${title}%`
      }
    }
    if (action && action != 0) {
      where['action'] = action
    }
    console.log("where", where)

    let result = await models.changelog.findAndCountAll({
      attributes: ['action', 'create_at'],
      include: [
        {
          model: models.pages,
          attributes: ['title']
        },
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
    }
  }

};
