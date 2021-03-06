"use strict";

module.exports = function (sequelize, DataTypes) {
    //user
    var User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        contact: DataTypes.STRING,
        is_active: DataTypes.BOOLEAN,
        email: DataTypes.STRING,
        salt: DataTypes.STRING
    },
        {
            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,

            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            // timestamps are enabled
            paranoid: true,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,

            // define the table's name
            tableName: 't_user',
            classMethods: {
                associate: function (models) {
                    User.hasMany(models.Project)
                }
            }
        }
    );
    return User;
};