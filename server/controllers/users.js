import models from '../models'

export default class {
  constructor() {
    this.url = '/users';
  }

  async get(ctx) {
    let users = await models.users.findAll();
    ctx.body = users;
  }

};
