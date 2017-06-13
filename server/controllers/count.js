const models = require('../models')

module.exports = class {
  static url = '/count';

  static async get(ctx) {
    let [result] = await models.pages.count({
      attributes: [
        [models.sequelize.literal('CASE WHEN `is_publish` = 0 THEN 1 ELSE NULL END'), 'working'],
        [models.sequelize.literal('CASE WHEN `is_publish` = 1 THEN 1 ELSE NULL END'), 'published']
      ],
      where: {
        is_delete: 0
      }
    })

    ctx.body = result;
  }

};
