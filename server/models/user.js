const createPool = require('../lib/db/mysql');
const mysql = require('promise-mysql');

const pool = createPool(mysql);

module.exports = class {
  static async findOrCreate(cp, data, fn) {
    let user = await find(data.id);
    if (!user) {
      let change = [ data._json.name, data._json.email, data._json.id ]
      let uid = await pool.query(
        'INSERT INTO `user` (`name`, `email`, `github_id`) VALUES (?)',
        [ change ]
      );
      fn(null, {
        id: uid,
        name: data._json.name
      })
    } else {
      fn(null, user)
    }
  }

  static async find(id) {
    let [ user ] = await pool.query('SELECT `id`, `name` FROM `user` WHERE `id` = ?', [ id ]);

    return user
  }

  static async findAll() {
    let users = await pool.query('SELECT * FROM `user`');

    return users
  }

};
