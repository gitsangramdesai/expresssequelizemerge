var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var userService = require("../services/userService")(sequelize);


// api/users
exports.Index = function (req, res) {
    userService.get(req, res).then(function (results) {
        res.send(results);
    }).done();
};

// api/user
exports.Create = function (req, res) {
    var newuser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        contact: req.body.contact,
        isActive: true
    };
    console.log('***' + JSON.stringify(newuser) + '***' + "\n");
    userService.findorcreate(newuser).then(function (result) {
        //console.log('##' + JSON.stringify(result) + '##');
        res.send(result);
    }).done();
};

