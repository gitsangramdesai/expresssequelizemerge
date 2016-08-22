var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
    //passport
    app.use(flash()); // use connect-flash for flash messages stored in session
    app.use(session({
        secret: 'ilovescotchscotchyscotchscotch',
        resave: true,
        saveUninitialized: true
    })); // session secret

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    passport.use(new LocalStrategy(
        function(username, password, done) {
            Model.User.findOne({
                where: {
                    'username': username
                }
            }).then(function(user) {
                if (user == null) {
                    return done(null, false, { message: 'Incorrect credentials.' })
                }

                var hashedPassword = bcrypt.hashSync(password, user.salt)

                if (user.password === hashedPassword) {
                    return done(null, user)
                }

                return done(null, false, { message: 'Incorrect credentials.' })
            })
        }
    ));

    return passport;
}