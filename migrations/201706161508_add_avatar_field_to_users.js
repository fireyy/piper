module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.describeTable('users').then(function(attributes){

      if (attributes.hasOwnProperty('avatar')) {
        return 1;
      }

      return queryInterface.addColumn(
        'users',
        'avatar',
        {
          type         : Sequelize.STRING(64),
          allowNull    : true,
          defaultValue : '',
        }
      );
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'avatar');
  }
};
