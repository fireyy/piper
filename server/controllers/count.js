const models = require('../models')

module.exports = class {
  constructor() {
    this.url = '/count';
  }

  async get(ctx) {
    let [result] = await models.pages.findAll({
      attributes: [
        [models.sequelize.fn('COUNT', models.sequelize.literal('CASE WHEN is_publish = 0 THEN 1 ELSE NULL END')), 'working'],
        [models.sequelize.fn('COUNT', models.sequelize.literal('CASE WHEN is_publish = 1 THEN 1 ELSE NULL END')), 'published']
      ],
      where: {
        is_delete: 0
      }
    })

    ctx.body = result;
  }

};
