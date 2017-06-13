require('dotenv').config();
const fs        = require("fs");
const path      = require("path");
const Sequelize = require('sequelize');

let {
  DATABASE_DIALECT = 'mysql',
  DATABASE_HOST = '127.0.0.1',
  DATABASE_PORT = 3306,
  DATABASE_NAME = 'piper',
  DATABASE_USER,
  DATABASE_PASSWORD
} = process.env;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: DATABASE_DIALECT,
  protocol: DATABASE_DIALECT,
  port: DATABASE_PORT,
  // 字段以下划线（_）来分割
  underscored: true,
  timezone: '+08:00',
  dialectOptions: {
    ssl: false
  },
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  }
});

let db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
