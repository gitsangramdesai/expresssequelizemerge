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
            timestamps: true,
            paranoid: false,
            underscored: true,
            freezeTableName: true,
            tableName: 't_language',
     });
    return Language;
};