module.exports = class {
  static url = '/count';

  static async get(ctx) {
    let [result] = await ctx.sql('\
      SELECT \
      COUNT( CASE WHEN `is_publish` = 0 THEN 1 ELSE NULL END ) AS `working`, \
      COUNT( CASE WHEN `is_publish` = 1 THEN 1 ELSE NULL END ) AS `published` \
      FROM `pages` WHERE `is_delete` = 0 \
    ');
    ctx.body = result;
  }

};
