const models = require('../models')

module.exports = class {
  constructor() {
    this.url = '/users';
  }

  async get(ctx) {
    let users = await models.users.findAll();
    ctx.body = users;
  }

};
