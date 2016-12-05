const authorize = require('../lib/authorize');
const __ = require('../constants');

module.exports = class {
  static url = '/page/:id';

  @authorize([ 'CHANGE' ])
  static async delete(ctx) {
    let { id } = ctx.params;
    await ctx.sql.commit('UPDATE `pages` SET `is_delete` = 1 WHERE `id` = ?', [ id ]);
    ctx.body = {
      message: 'Delete success'
    };
  }

  @authorize([ 'EDIT' ])
  static async get(ctx) {
    let { id } = ctx.params;
    let result = await ctx.sql('                                                                                \
      SELECT `id`, `path`, `title`, `comment`, `items`, `create_by`, `create_at`               \
        FROM `pages` WHERE `id` = ? AND `is_delete` = 0                                                          \
    ', [ id ]);
    let page = result[0];
    if (!page) throw { status: 404, name: 'PAGES_NOT_FOUND', message: 'page is not found' };
    try { page.items = JSON.parse(page.items); } catch(error) {
      throw { status: 500, name: 'JSON_PARSE_ERROR', message: 'json parse error' }
    };
    ctx.body = page;
  }

  @authorize([ 'EDIT' ])
  static async put(ctx) {
    let { id } = ctx.params;
    let { body } = ctx.request;
    let change = Object.create(null);
    let count = [ 'title', 'items' ].reduce((count, name) => {
      if (!(name in body)) return count;
      change[name] = body[name];
      return count + 1;
    }, 0);
    if (count === 0) throw { status: 400, name: 'ERR', message: 'require `title` or/and `items` in request body' };
    if ('items' in change) {
      change.items = JSON.stringify(change.items);
      if (change.items.length > __.VALUE_MAX_LENGTH) throw __.VALUE_TOO_LONG;
    }
    await ctx.sql.commit(async () => {
      let [ page ] = await ctx.sql('SELECT `is_delete`, `items` FROM `pages` WHERE `id` = ?', [ id ]);
      if (!page || page.is_delete) throw { status: 404, name: 'PAGE_NOT_FOUND', message: 'page is not found' };
      await ctx.sql('UPDATE `pages` SET ? WHERE `id` = ?', [ change, id ]);
    });
    ctx.body = {
      message: 'Save success'
    };
  }

};
