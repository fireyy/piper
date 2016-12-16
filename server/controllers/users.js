const authorize = require('../lib/authorize');
const users = require('../users');

module.exports = class {
  static url = '/users';

  @authorize(['EDIT'])
  static async get(ctx) {
    ctx.body = users;
  }

};
