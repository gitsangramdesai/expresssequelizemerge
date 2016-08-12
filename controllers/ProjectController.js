var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var projectService = require("../services/projectService")(sequelize);

//all data once
exports.Index = function (req, res) {
    projectService.get(req, res).then(function (results) {
        res.render('project/index.ejs', { projects: results });
    }).done();
};

//gives data required only in page
exports.GetPage = function (req, res) {
    var valueArray = [];
    var pageRequest = {
        start: (req.body.start) ? req.body.start : 0,
        length: (req.body.length) ? req.body.length : 10,
        draw: (req.body.draw) ? req.body.draw : 1,
    };

    console.log(JSON.stringify(pageRequest));
    

    projectService.getPage(pageRequest).then(function (results) {
        projectService.getTotalCount(pageRequest, results).then(function (TotalCount) {
            for (var i = 0, len = results.length; i < len; i++) {
                valueArray[i] = [results[i].id, results[i].name, results[i].UserId, results[i].createdAt, results[i].updatedAt];
            }
            var pagingResponse = { "draw": pageRequest.draw + 1, "recordsTotal": TotalCount, "recordsFiltered": TotalCount, "data": valueArray };
            console.log(JSON.stringify(pagingResponse));
            res.send(pagingResponse);
        })
    }).done();
};



//only send html
exports.ServerSidePaging = function (req, res) {
    res.render('project/ServerSidePaging.ejs');
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