const User = require('../models/user')

module.exports = class {
  static url = '/users';

  static async get(ctx) {
    let users = await User.findAll();
    ctx.body = users;
  }

};
