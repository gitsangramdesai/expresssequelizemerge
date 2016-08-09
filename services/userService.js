//do not use done here
module.exports = function (sequelize) {
    var models = require("../models");
    var User = models.User;

    return {
        create: function (newUser) {
            return User.create(newUser).then(function () {
                return { status: true, message: 'OK', error: null };
            }).error(function (err) {
                return { status: true, message: 'OK', error: err };
            });
        },
        findthencreate: function (newUser) {
            return User.find(
                {
                    where: sequelize.or(
                        { email: newUser.email.toUpperCase() },
                        { email: newUser.email.toLowerCase() }
                    )
                }).then(function (user) {
                    //console.log('9090' + JSON.stringify(user) + '9090');
                    if (user == null) {
                        return User.create({
                            email: newUser.email.toUpperCase(),
                            username: newUser.username,
                            password: newUser.password,
                            contact: newUser.contact,
                            isActive: true
                        }).then(function (newUser) {
                            //console.log('succes new user id:' + newUser.id);
                            return { status: true, message: 'OK', error: null };
                        }).error(function (err) {
                            //console.log('error', err);
                            return { status: false, message: err.message, error: err };
                        });
                    } else {
                        return { status: false, message: "user already exist", error: null };
                    }
                }).error(function (err) {
                    //console.log('outer error', err);
                    return { status: false, message: err.message, error: err };
                });
        },
        findorcreate: function (newUser) {
            return User.findOrCreate({
                where: {
                    email: sequelize.or([ newUser.email.toUpperCase() , newUser.email.toLowerCase()])
                },
                defaults: { // set the default properties if it doesn't exist
                    email: newUser.email.toUpperCase(),
                    username: newUser.username,
                    password: newUser.password,
                    contact: newUser.contact,
                    isActive: true
                }
           }).spread(function (user, created) {
                console.log("\n :::" + JSON.stringify(created));
                if (created) {
                    return { status: true, message: 'OK', error: null };
                } else {
                    return { status: false, message: "user already exist", error: null };
                }

            }).error(function (err) {
                //console.log('Error occured', err);
                return { status: false, message: err.message, error: err };
            });
        },
        get: function (req, res) {
            return User.findAll().then(function (users) {
                return users;
            }).error(function (err) {
                return null;
            });
        }
    };
};