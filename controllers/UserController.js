var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var userService = require("../services/userService")(sequelize);


// api/users
exports.Index = function(req, res) {
    userService.get(req, res).then(function(results) {
        res.send(results);
    }).done();
};

// api/user
exports.Create = function(req, res) {
    var newuser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        contact: req.body.contact,
        isActive: true
    };
    userService.findorcreate(newuser).then(function(result) {
        res.send(result);
    }).done();
};

//signup
exports.signup = function(req, res) {
    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2
    var userContact = req.body.contact
    var userEmail = req.body.email;

    if (!username || !userEmail || !password || !password2) {
        req.flash('error', "Please, fill in all the fields.")
        res.redirect('signup')
    }

    if (password !== password2) {
        req.flash('error', "Please, enter the same password twice.")
        res.redirect('signup')
    }

    var salt = bcrypt.genSaltSync(10)
    var hashedPassword = bcrypt.hashSync(password, salt)

    var newUser = {
        username: username,
        salt: salt,
        password: hashedPassword,
        isActive: true,
        contact: userContact,
        email: userEmail
    }

    userService.findorcreate(newUser).then(function(result) {
        res.redirect('/')
    }).catch(function(error) {
        req.flash('error', "Please, choose a different username.")
        res.redirect('/signup')
    }).done();
}