require('dotenv').config();
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: process.env.DATABASE_PORT || '3306',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'piper'
  }, (err) => {
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
