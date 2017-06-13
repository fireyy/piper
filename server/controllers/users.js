const models = require('../models')

module.exports = class {
  static url = '/users';

  static async get(ctx) {
    let users = await models.users.findAll();
    ctx.body = users;
  }

};
