/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let changelog = sequelize.define('changelog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    // page_id: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: false
    // },
    items: {
      type: DataTypes.STRING(10240),
      allowNull: true,
      defaultValue: ''
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    update_at: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_at: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'changelog'
  });

  changelog.associate = function(models) {
    changelog.belongsTo(models.pages, {foreignKey: 'page_id'});
    changelog.belongsTo(models.users, {foreignKey: 'create_by'});
  }

  return changelog;
};
