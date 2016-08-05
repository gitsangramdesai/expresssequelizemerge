'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    //users
    queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true,
        max: 50
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false,
        max: 15,
        min: 10,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    }).then(
      //project: it requires users table
      queryInterface.createTable('Projects', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          max: 50
        },
        //foreign key usage
        userid: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
      }).then(done)
      );
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('projects');
    queryInterface.dropTable('Users');
    queryInterface.dropTable('SequelizeMeta');
  }
};
