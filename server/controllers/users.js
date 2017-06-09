const authorize = require('../lib/authorize');
const User = require('../models/user')

module.exports = class {
  static url = '/users';

  @authorize(['EDIT'])
  static async get(ctx) {
    let users = await User.findAll();
    ctx.body = users;
  }

};
