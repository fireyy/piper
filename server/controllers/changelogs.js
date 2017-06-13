const models = require('../models');

module.exports = class {
  static url = '/changelogs';

  static async get(ctx) {
    let { page, size } = ctx.query;
    page = parseInt(page, 10)
    size = parseInt(size, 10)
    let start = (page - 1) * size;
    let limit = size;
    let result = await models.changelog.findAndCountAll({
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
