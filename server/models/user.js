const createPool = require('../lib/db/mysql');
const mysql = require('promise-mysql');

const pool = createPool(mysql);

module.exports = class {
  static async findOrCreate(cp, data, fn) {
    let [ user ] = await pool.query('SELECT `id`, `name` FROM `user` WHERE `github_id` = ?', [ data.id ]);
    if (!user) {
      let change = [ data._json.name, data._json.email, data._json.id ]
      let res = await pool.query(
        'INSERT INTO `user` (`name`, `email`, `github_id`) VALUES (?)',
        [ change ]
      );
      fn(null, {
        id: res.insertId,
        name: data._json.name
      })
    } else {
      fn(null, user)
    }
  }

  static async findOne(id) {
    let [ user ] = await pool.query('SELECT `id`, `name` FROM `user` WHERE `id` = ?', [ id ]);

    return user
  }

  static async findAll() {
    let users = await pool.query('SELECT * FROM `user`');

    return users
  }

};
