const authorize = require('../lib/authorize');
const __ = require('../constants');
const createby = require('../lib/createby');

module.exports = class {
  static url = '/pages';

  @authorize(['EDIT'])
  static async get(ctx) {
    let { page, size, title, isPublish } = ctx.query;
    page = parseInt(page, 10)
    size = parseInt(size, 10)
    let start = (page - 1) * size;
    let limit = size;
    let where = (title ? ' and `title` LIKE "%' + title + '%"' : '') + (isPublish != -1 ? ' and `is_publish` = ' + isPublish : '');
    let [total] = await ctx.sql('SELECT COUNT(*) AS count FROM `pages` WHERE `is_delete` = 0' + where);
    let query = '\
      SELECT `id`, `title`, `cover`, `create_by`, `create_at`, `update_at`, `publish_at` \
        FROM `pages` WHERE `is_delete` = 0' + where + ' ORDER BY `create_at` DESC LIMIT ?,? \
    ';
    let result = await ctx.sql(query, [start, limit]);
    await createby(result);
    ctx.body = {
      total: total.count,
      page: page,
      size: size,
      data: result
    };
  }

  @authorize(['CHANGE'])
  static async put(ctx) {
    let { title = '', config = '', items = '' } = ctx.request.body;
    title = title.trim();
    if (!title) throw { status: 400, name: 'ERROR_PARAMS', message: 'Title 不能为空' };
    items = JSON.stringify(items);
    if (items.length > __.VALUE_MAX_LENGTH) throw __.VALUE_TOO_LONG;
    config = JSON.stringify(config);

    let data;
    await ctx.sql.commit(async () => {

      let pages = await ctx.sql(
        'SELECT 1 FROM `pages` WHERE `is_delete` = 0 AND `title` = ? FOR UPDATE',
        [ title ]
      );
      if (pages.length) throw { status: 400, name: 'DUP', message: '记录已存在' };

      data = await ctx.sql(
        'INSERT INTO `pages` (`title`, `config`, `items`, `create_by`) VALUES (?)',
        [ [ title, config, items, ctx.user.id ] ]
      );

      await ctx.sql(
        'INSERT INTO `changelog` (`action`, `page_id`, `items`, `create_by`) VALUES (?)',
        [ [ 1, data.insertId, items, ctx.user.id ] ]
      );

    });

    ctx.body = {
      message: 'Save success',
      item: data
    };
  }

};
