//do not use .done here
module.exports = function(sequelize) {
    var db = require("../models");

    return {
        get: function(req, res) {
            return db.Project.findAll().then(function(projects) {
                return projects;
            }).error(function(err) {
                return null;
            });
        },
        save: function(req, res) {
           console.log(JSON.stringify(req.body));
            return null;
        },
        getPage: function(pagingRequest) {
            return db.Project.findAll({
                where: {name: { $iLike: '%' + pagingRequest.search + '%' }},
                order: [[pagingRequest.sort,pagingRequest.order]],
                limit: pagingRequest.length,
                offset: pagingRequest.start,
            }).then(function(projects) {
                return projects;
            }).error(function(err) {
                return null;
            });
        },
        getTotalCount: function(pageRequest) {
            return db.Project.count({
                }).then(function(TotalCount) {
                return TotalCount;
            }).error(function(err) {
                return null;
            });
        },
        getUserProject: function(req, res) {
            return db.Project.findAll({
                where: {
                    UserId: req.body.UserId
                },
                include: [dn.User]
            }).then(function(projects) {
                return projects;
            }).error(function(err) {
                return null;
            });
        },
        getUserProjectCount: function(req, res) {
            return db.Project.findAll({
                attributes: ['User.username', [sequelize.fn('COUNT', sequelize.col('Project.id')), 'ProjectCount']],
                include: [{
                    model: db.User,
                    attributes: [],
                    include: []
                }],
                group: ['User.username'],
                raw: true
            }).then(function(projects) {
                return projects;
            }).error(function(err) {
                return null;
            })
        },
        findthencreate: function(newProject) {
            return db.User.find({
                where: {
                    name: sequelize.or([newProject.name.toUpperCase(), newProject.name.toLowerCase()])
                }
            }).then(function(project) {
                //console.log('9090' + JSON.stringify(user) + '9090');
                if (project == null) {
                    return db.Project.create({
                        name: newProject.name,
                        UserId: newProject.UserId
                    }).then(function(newProject) {
                        //console.log('succes new user id:' + newProject.id);
                        return { status: true, message: 'OK', error: null };
                    }).error(function(err) {
                        //console.log('error', err);
                        return { status: false, message: err.message, error: err };
                    });
                } else {
                    return { status: false, message: "Project already exist", error: null };
                }
            }).error(function(err) {
                //console.log('outer error', err);
                return { status: false, message: err.message, error: err };
            });
        },
        findorcreate: function(newProject) {
            return db.Project.findOrCreate({
                where: {
                    name: sequelize.or(
                        [newProject.name.toUpperCase(), newProject.name.toLowerCase()]
                    )
                },
                defaults: { // set the default properties if it doesn't exist
                    name: newProject.name,
                    UserId: newProject.UserId
                }
            }).spread(function(user, created) {
                //console.log(':::' + JSON.stringify(created));
                if (created) {
                    return { status: true, message: 'OK', error: null };
                } else {
                    return { status: false, message: "Project already exist", error: null };
                }
            }).error(function(err) {
                //console.log('Error occured', err);
                return { status: false, message: err.message, error: err };
            });
        }
    };
};