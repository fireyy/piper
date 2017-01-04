const authorize = require('../lib/authorize');
const createby = require('../lib/createby');

module.exports = class {
  static url = '/changelogs';

  @authorize('')
  static async get(ctx) {
    let { page, size } = ctx.query;
    page = parseInt(page, 10)
    size = parseInt(size, 10)
    let start = (page - 1) * size;
    let limit = size;
    let [total] = await ctx.sql('SELECT COUNT(*) AS count FROM `changelog`');
    let result = await ctx.sql('                                            \
      SELECT pages.`id`, pages.`title`, changelog.`id`, changelog.`action`, \
       changelog.`page_id`, changelog.`create_by`, changelog.`create_at`    \
        FROM `changelog` Left Join `pages` On changelog.page_id=pages.id    \
      ORDER BY `create_at` DESC LIMIT ?,?  \
    ', [start, limit]);
    await createby(result);
    ctx.body = {
      total: total.count,
      page: page,
      size: size,
      data: result
    }
  }

};
