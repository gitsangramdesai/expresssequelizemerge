'use strict';
var Promise = require('bluebird');
var dateFormat = require('dateformat');
var dateString = dateFormat((new Date()), "yyyy-mm-dd HH:MM:ss");

module.exports = {
    up: function (queryInterface, Sequelize) {

        return Promise
            .resolve()
            .then(function () {
                return queryInterface.bulkInsert('Users', [
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
                    },
                    {
                        id: 3,
                        createdAt: dateString,
                        updatedAt: dateString,
                        username: 'sangram',
                        email: 'sangram@gmail.com',
                        contact: '919860868345',
                        password: 'pass@1273',
                        isActive: true
                    },
                    {
                        id: 4,
                        createdAt: dateString,
                        updatedAt: dateString,
                        username: 'sangramd',
                        email: 'sangramd@kmail.com',
                        contact: '919860868345',
                        password: 'pass@1234',
                        isActive: true
                    }
                ]);
            })
            .then(function (res1) {
                return queryInterface.bulkInsert('Projects', [
                    {
                        id: 1,
                        createdAt: dateString,
                        updatedAt: dateString,
                        UserId: 1,
                        name: 'studmonk',
                    },
                    {
                        id: 2,
                        createdAt: dateString,
                        updatedAt: dateString,
                        UserId: 2,
                        name: 'LinkSync',
                    },
                    {
                        id: 3,
                        createdAt: dateString,
                        updatedAt: dateString,
                        UserId: 2,
                        name: 'WinkSync',
                    },
                    {
                        id: 4,
                        createdAt: dateString,
                        updatedAt: dateString,
                        UserId: 1,
                        name: 'EduSync',
                    },
                    {
                        id: 5,
                        createdAt: dateString,
                        updatedAt: dateString,
                        UserId: 1,
                        name: 'SellWise',
                    }
                ]);
            }).then(function (res2) {
                return queryInterface.sequelize.query("ALTER SEQUENCE \"Users_id_seq\" restart with 5");
            })
            .then(function (res3) {
                return queryInterface.sequelize.query("ALTER SEQUENCE \"Projects_id_seq\" restart with 6");
            });
    },

    down: function (queryInterface, Sequelize) {
        return Promise
            .resolve()
            .then(function () {
                return queryInterface.dropTable('delete from "Projects"');
            }).then(function (rsp1) {
                return queryInterface.dropTable('delete from "Users"');
            }).then(function (rsp2) {
                return queryInterface.dropTable('delete from "SequelizeMeta"');
            }).then(function (rsp3) {
                return queryInterface.sequelize.query("ALTER SEQUENCE \"Users_id_seq\" restart with 1");
            }).then(function (rsp4) {
                return queryInterface.sequelize.query("ALTER SEQUENCE \"Projects_id_seq\" restart with 1");
            });
    }
};


