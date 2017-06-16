/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    github_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    avatar: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: '',
    }
  }, {
    tableName: 'users'
  });

  users.associate = function(models) {
    users.hasOne(models.changelog, {foreignKey: 'create_by'});
    users.hasOne(models.pages, {foreignKey: 'create_by'});
  }

  return users;
};
