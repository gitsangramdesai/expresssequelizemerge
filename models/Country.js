"use strict";

module.exports = function (sequelize, DataTypes) {
    //user
    var Country = sequelize.define("Country", {
        name: DataTypes.STRING,
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.User,
                key: "id"
            }
        },
        deleted_at:DataTypes.DATE
    },
     {
            // don't add the timestamp attributes (updated_at, created_at)
            timestamps: true,

            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            // timestamps are enabled
            paranoid: false,

            // don't use camelcase for automatically added attributes but underscore style
            // so updated_at will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,

            // define the table's name
            tableName: 't_country',
     });
    return Country;
};