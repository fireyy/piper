const authorize = require('../lib/authorize');
const createby = require('../lib/createby');

module.exports = class {
  static url = '/changelogs';

  @authorize('')
  static async get(ctx) {
    let result = await ctx.sql('\
      SELECT `id`, `action`, `page_id`, `create_by`, `create_at` \
        FROM `changelog` \
    ');
    await createby(result);
    ctx.body = result;
  }

};
