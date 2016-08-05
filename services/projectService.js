module.exports = function (sequelize) {
    //var model = require("../models/model")(sequelize);
    var models = require("../models");

    var Project = models.Project;
    var User = models.User;

    return {
        create: function (req, res) {
            var newProject = {
                name: req.body.name,
                UserId:req.body.UserId
            }
            Project.create(newProject).then(function () {
                console.log(req.body.UserId);
                res.send(200);
            });
        },
        get: function (req, res) {
            Project.findAll().then(function (projects) {
                res.send(projects);
            });
        },
        getUserProjectCount: function (req, res) {
            Project.findAll(
                {
                    attributes: ['User.username', [sequelize.fn('COUNT', sequelize.col('Project.id')), 'ProjectCount']],
                    include: [
                        {
                            model: User,
                            attributes: [],
                            include: []
                        }
                    ],
                    group: ['User.username'],
                    raw:true
                }
            ).then(function (projects) {
                res.send(projects);
            });
        }
    };
};

