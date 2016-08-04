module.exports = function (sequelize) {
    var model = require("../models/model")(sequelize);
    var User = model.User;
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