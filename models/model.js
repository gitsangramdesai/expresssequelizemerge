var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    //user
    var User = sequelize.define("User", {
        username: Sequelize.STRING,
        password: Sequelize.STRING
    });

    //project
    var Project = sequelize.define('Project', {
        name: Sequelize.STRING,
        UserId:{
             type:Sequelize.INTEGER,
             references: User,             
             referencesKey: 'id',
        }
    }
    );

    return {
        User: User,
        Project:Project
    };
};
