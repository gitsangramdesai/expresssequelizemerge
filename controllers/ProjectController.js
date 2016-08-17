var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var projectService = require("../services/projectService")(sequelize);


//all results
exports.Index = function (req, res) {
    projectService.get(req, res).then(function (results) {
        res.send(results);
    }).done();
};

//gives data required only in page
exports.GetPage = function (req, res) {
    var valueArray = [];
    var pagingRequest = {
        sort: (req.query.sort) ? req.query.sort : 'id',
        order: (req.query.order) ? req.query.order : 'asc',
        start: (req.query.start) ? req.query.start : 0,
        length: (req.query.length) ? req.query.length : 10,
        draw: (req.query.draw) ? req.query.draw : 1,
        search: (req.query.search) ? req.query.search : ''
    };
    console.log(JSON.stringify(pagingRequest));

    projectService.getPage(pagingRequest).then(function (results) {
        projectService.getTotalCount(pagingRequest, results).then(function (TotalCount) {
            for (var i = 0, len = results.length; i < len; i++) {
                valueArray[i] = [results[i].id, results[i].name, results[i].UserId, results[i].createdAt, results[i].updatedAt];
            }
            var pagingResponse = { "draw": pagingRequest.draw + 1, "recordsTotal": TotalCount, "recordsFiltered": TotalCount, "data": valueArray };
            //console.log(JSON.stringify(pagingResponse));
            res.send(pagingResponse);
        })
    }).done();
};

exports.GetBSPage = function (req, res) {
    var bsPagingRequest = {
        sort: (req.query.sort) ? req.query.sort : 'id',
        order: (req.query.order) ? req.query.order : 'asc',
        start: (req.query.offset) ? req.query.offset : 0,
        length: (req.query.limit) ? req.query.limit : 10,
        search: (req.query.search) ? req.query.search : ''
    };
    console.log(JSON.stringify(bsPagingRequest));

    projectService.getPage(bsPagingRequest).then(function (results) {
        projectService.getTotalCount(bsPagingRequest, results).then(function (TotalCount) {
            var bsPagingResponse = { "total": TotalCount, "rows": results };
            //console.log(JSON.stringify(pagingResponse));
            res.send(bsPagingResponse);
        })
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

exports.save = function (req, res) {
    projectService.save(req, res);
};


/********************HTML******************* */
//only send html
exports.PagingOnServer = function (req, res) {
    res.render('datatable/PagingOnServer.ejs');
};
exports.PagingOnClient = function (req, res) {
    projectService.get(req, res).then(function (results) {
        res.render('datatable/PagingOnClient.ejs', { projects: results });
    }).done();
};
exports.BsTableDemo = function (req, res) {
    res.render('bstable/demo.ejs');
};