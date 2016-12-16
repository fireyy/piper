const authorize = require('../lib/authorize');
const createby = require('../lib/createby');

module.exports = class {
  static url = '/changelogs';

  @authorize('')
  static async get(ctx) {
    let result = await ctx.sql('                                            \
      SELECT pages.`id`, pages.`title`, changelog.`id`, changelog.`action`, \
       changelog.`page_id`, changelog.`create_by`, changelog.`create_at`    \
        FROM `changelog` Left Join `pages` On changelog.page_id=pages.id    \
    ');
    await createby(result);
    ctx.body = result;
  }

};
