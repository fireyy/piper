require('dotenv').config();
const fs        = require("fs");
const path      = require("path");
const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || "development";
const config    = require(path.join(__dirname, '../../', 'config', 'db.js'))[env];

const params = Object.assign({
  // 字段以下划线（_）来分割
  underscored: true,
  dialectOptions: {
    ssl: false
  },
  define: {
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
  },
  // logging: false
}, config);

let sequelize

if (config.url) {
  sequelize = new Sequelize(config.url, params);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, params);
}

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
