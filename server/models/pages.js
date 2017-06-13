/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let pages = sequelize.define('pages', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    cover: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: ''
    },
    config: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: ''
    },
    items: {
      type: DataTypes.STRING(10240),
      allowNull: false
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    is_publish: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    is_delete: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    publish_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.NOW
    }
  }, {
    tableName: 'pages'
  });

  pages.associate = function(models) {
    pages.hasOne(models.changelog, {foreignKey: 'page_id'});
    pages.belongsTo(models.users, {foreignKey: 'create_by'});
  }

  return pages;
};
