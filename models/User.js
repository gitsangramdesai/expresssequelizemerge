"use strict";

module.exports = function (sequelize, DataTypes) {
  //user
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    contact: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    email: DataTypes.STRING
  }, {
      classMethods: {
        associate: function (models) {
          User.hasMany(models.Project)
        }
      }
    });
  return User;
};