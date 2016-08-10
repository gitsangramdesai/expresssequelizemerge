var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var projectService = require("../services/projectService")(sequelize);

// api/projects
/*exports.Index = function (req, res) {
    projectService.get(req, res).then(function (results) {
        res.send(results);
    }).done();
};*/

 
exports.Index = function (req, res) {
    projectService.get(req, res).then(function (results) {
        res.render('project/index.ejs', {projects:results});
        //res.send(results);
    }).done();
};

// api/user/projects
exports.GetUserProject = function (req, res) {
    projectService.getUserProject(req, res).then(function (results) {
        res.send(results);
    }).done();
};

// /api/projects/projectsummary
exports.GetUserProjectCount = function (req, res) {
    projectService.getUserProjectCount(req, res).then(function (results) {
        res.send(results);
    }).done();
};

// api/project 
exports.Create = function (req, res) {
    var newProject = {
        name: req.body.name,
        UserId: req.body.UserId
    };
    //console.log('***' + JSON.stringify(newProject) + '***');
    projectService.findorcreate(newProject).then(function (result) {
        //console.log('##' + JSON.stringify(result) + '##');
        res.send(result);
    }).done();
};




