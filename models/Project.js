"use strict";

module.exports = function (sequelize, DataTypes) {
    //project
    var Project = sequelize.define("Project", {
        name: DataTypes.STRING,
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.User,
                key: "id"
            }
        }
    }, {
            classMethods: {
                associate: function (models) {
                    Project.belongsTo(models.User, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
    });

    return Project;
};