var express = require('express');
var router = express.Router();

module.exports = function(app, passport, Controllers) {

    var isAuthenticated = function(req, res, next) {
        if (req.isAuthenticated())
            return next();
        req.flash('error', 'You have to be logged in to access the page.');
        res.redirect('/');
    }

    router.get('/profile', isAuthenticated, function(req, res) {
        res.render('auth/profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
        console.log(req.user);
    });

    router.get('/signup', function(req, res) {
        res.render('auth/signup.ejs', { message: req.flash('signupMessage') });
    });

    router.post('/signup', passport.authenticate('local', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.get('/login', function(req, res) {
        res.render('auth/login.ejs', { message: req.flash('loginMessage') });
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }))

    router.get('/', function(req, res, next) {
        res.render('index.ejs', { title: 'Express' });
    });

    router.get('/logout', function(req, res) {
        req.logout()
        res.redirect('/')
    })

    //----------------------API--------------------------------
    //Users
    router.get('/users', Controllers.User.Index);
    router.post('/user', Controllers.User.Create);

    //Projects
    router.get('/Projects', Controllers.Project.Index);
    router.post('/project', Controllers.Project.Create);
    router.post('/project/save', Controllers.Project.save);
    router.post('/user/projects', Controllers.Project.GetUserProject);
    router.get('/projects/projectsummary', Controllers.Project.GetUserProjectCount);
    router.post('/project/delete', Controllers.Project.Delete);
    router.post('/project/bulkdelete', Controllers.Project.BulkDelete);


    //get paged data
    router.get('/Projects/getpage', Controllers.Project.GetPage);
    router.get('/Projects/getbspage', Controllers.Project.GetBSPage);

    //sends  html only
    router.get('/Projects/pagingonserver', Controllers.Project.PagingOnServer);
    router.get('/Projects/pagingonclient', Controllers.Project.PagingOnClient);

    router.get('/Projects/BsTableDemo', Controllers.Project.BsTableDemo);

    return router;
};