module.exports = function (sequelize) {
    var models = require("../models");
    var User = models.User;
    
    return {
        create: function (req, res) {
            var newUser = {
                username: req.body.username,
                password: req.body.password
            }
            User.create(newUser).then(function () {
                res.send(200);
            });
        },
        get: function (req, res) {
            User.findAll().then(function (users) {
                res.send(users);
            });
        }
    };
};