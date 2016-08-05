'use strict';
var dateFormat = require('dateformat');

var now = new Date();
var dateString = dateFormat(now, "yyyy-mm-dd HH:MM:ss");;

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
      queryInterface.bulkInsert('Users', [
      {
        id: 1,
        createdAt: dateString,
        updatedAt: dateString,
        username: 'sangram2681',
        email: 'sangram2681@gmail.com',
        contact: '919890868345',
        password: 'pass@123',
        isActive: true
      },
      {
        id: 2,
        createdAt: dateString,
        updatedAt: dateString,
        username: 'sangram.desai',
        email: 'sangram.desai@ymail.com',
        contact: '919890868345',
        password: 'pass@123',
        isActive: true
      }
    ]).then(done)
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

  }
};
