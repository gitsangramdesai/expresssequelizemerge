'use strict';
var Promise = require('bluebird');

module.exports = {
    up: function(queryInterface, Sequelize) {
        return Promise
            .resolve()
            .then(function() {
                return queryInterface.createTable('t_user', {
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    created_at: {
                        type: Sequelize.DATE
                    },
                    updated_at: {
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
                        unique: true,
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
                    is_active: {
                        type: Sequelize.BOOLEAN,
                        defaultValue: false,
                        allowNull: false
                    },
                    salt: {
                        type: Sequelize.STRING,
                        allowNull: true
                    }
                });
            })
            .then(function(initialSchema) {
                return queryInterface.createTable('t_project', {
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    created_at: {
                        type: Sequelize.DATE
                    },
                    updated_at: {
                        type: Sequelize.DATE
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        max: 50
                    },
                    //foreign key usage
                    user_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Users',
                            key: 'id',
                            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade'
                    }
                });
            }).then(function(initialSchema) {
                return queryInterface.createTable('t_country', {
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        autoIncrement: true
                    },
                    created_at: {
                        type: Sequelize.DATE
                    },
                    updated_at: {
                        type: Sequelize.DATE
                    },
                    deleted_at: {
                        type: Sequelize.DATE
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        max: 50
                    },
                    //foreign key usage
                    user_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Users',
                            key: 'id',
                            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade'
                    }
                });
            })
    },
    down: function(queryInterface, Sequelize) {
        return Promise
            .resolve()
            .then(function() {
                queryInterface.dropTable('t_project');
                queryInterface.dropTable('SequelizeMeta');
            })
            .then(function(dropSql) {
                queryInterface.dropTable('t_user');
            });
    }
};