require('dotenv').config();

let {
  DATABASE_DIALECT = 'mysql',
  DATABASE_STORAGE = './db.sqlite',
  DATABASE_HOST = '127.0.0.1',
  DATABASE_PORT = 3306,
  DATABASE_NAME = 'piper',
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_URL
} = process.env;

let base = {
  "username": DATABASE_USER,
  "password": DATABASE_PASSWORD,
  "database": DATABASE_NAME,
  "host": DATABASE_HOST,
  "port": DATABASE_PORT,
  "dialect": DATABASE_DIALECT,
  "storage": DATABASE_STORAGE,
  "url": DATABASE_URL
};

module.exports = {
  "development": base,
  "test": base,
  "production": base
}
