const mysql = require('mysql');
const config = require('../config.js');
const pool = mysql.createPool(config.mysql, (err) => {
  console.log(err);
});
const promisify = require('es6-promisify');

module.exports = async (ctx, next) => {
  let connection = await promisify(pool.getConnection, { thisArg: pool })();
  let query = promisify(connection.query, { thisArg: connection });
  ctx.sql = query;
  ctx.sql.commit = async (what, ...args) => {
    await query('START TRANSACTION');
    try {
      switch (typeof what) {
        case 'function':
          await what(...args);
          break;
        case 'object':
          for (let str in what) await query(str, what[str]);
          break;
        default:
          await query(what, ...args);
      }
      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  };
  try {
    return next();
  } finally {
    connection.release();
  }
};
