'use strict';
var Promise = require('bluebird');
var dateFormat = require('dateformat');
var dateString = dateFormat((new Date()), "yyyy-mm-dd HH:MM:ss");

module.exports = {
    up: function (queryInterface, Sequelize) {

        return Promise
            .resolve()
            .then(function () {
                return queryInterface.bulkInsert('t_user', [
                    {
                        id: 1,
                        created_at: dateString,
                        updated_at: dateString,
                        username: 'sangram2681',
                        email: 'sangram2681@gmail.com',
                        contact: '919890868345',
                        password: 'pass@123',
                        is_active: true
                    },
                    {
                        id: 2,
                        created_at: dateString,
                        updated_at: dateString,
                        username: 'sangram.desai',
                        email: 'sangram.desai@ymail.com',
                        contact: '919890868345',
                        password: 'pass@123',
                        is_active: true
                    },
                    {
                        id: 3,
                        created_at: dateString,
                        updated_at: dateString,
                        username: 'sangram',
                        email: 'sangram@gmail.com',
                        contact: '919860868345',
                        password: 'pass@1273',
                        is_active: true
                    },
                    {
                        id: 4,
                        created_at: dateString,
                        updated_at: dateString,
                        username: 'sangramd',
                        email: 'sangramd@kmail.com',
                        contact: '919860868345',
                        password: 'pass@1234',
                        is_active: true
                    }
                ]);
            })
            .then(function (res1) {
                return queryInterface.bulkInsert('t_project', [
                    {
                        id: 1,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'studmonk',
                    },
                    {
                        id: 2,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 2,
                        name: 'LinkSync',
                    },
                    {
                        id: 3,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 2,
                        name: 'WinkSync',
                    },
                    {
                        id: 4,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'EduSync',
                    },
                    {
                        id: 5,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'SellWise',
                    }
                ]);
            }).then(function (res1) {
                return queryInterface.bulkInsert('t_country', [
                    {
                        id: 1,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'india',
                    },
                    {
                        id: 2,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 2,
                        name: 'indonesia',
                    },
                    {
                        id: 3,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 2,
                        name: 'israel',
                    },
                    {
                        id: 4,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'egypt',
                    },
                    {
                        id: 5,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'us',
                    },
                    {
                        id: 6,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'uk',
                    },
                    {
                        id: 7,
                        created_at: dateString,
                        updated_at: dateString,
                        user_id: 1,
                        name: 'canada',
                    }
                ]);
            }).then(function (res2) {
                return queryInterface.sequelize.query("ALTER SEQUENCE t_user_id_seq restart with 5");
            })
            .then(function (res3) {
                return queryInterface.sequelize.query("ALTER SEQUENCE t_project_id_seq restart with 6");
            })
            .then(function (res3) {
                return queryInterface.sequelize.query("ALTER SEQUENCE t_country_id_seq restart with 8");
            });
    },

    down: function (queryInterface, Sequelize) {
        return Promise
            .resolve()
            .then(function () {
                return queryInterface.dropTable('delete from t_project');
            }).then(function (rsp1) {
                return queryInterface.dropTable('delete from t_user');
            }).then(function (rsp2) {
                return queryInterface.dropTable('delete from t_sequelizemeta');
            }).then(function (rsp2) {
                return queryInterface.dropTable('delete from t_country');
            }).then(function (rsp3) {
                return queryInterface.sequelize.query("ALTER SEQUENCE t_user_id_seq restart with 1");
            }).then(function (rsp4) {
                return queryInterface.sequelize.query("ALTER SEQUENCE t_project_id_seq restart with 1");
            }).then(function (rsp4) {
                return queryInterface.sequelize.query("ALTER SEQUENCE t_country_id_seq restart with 1");
            });
    }
};


