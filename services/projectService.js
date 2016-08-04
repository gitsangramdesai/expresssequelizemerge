module.exports = function (sequelize) {
    var model = require("../models/model")(sequelize);
    var Project = model.Project;
    return {
        create: function (req, res) {
            var newProject = {
                name: req.body.name,
                UserId:req.body.UserId
            }
            Project.create(newProject).success(function () {
                console.log(req.body.UserId);
                res.send(200);
            });
        },
        get: function (req, res) {
            Project.findAll().success(function (projects) {
                res.send(projects);
            });
        }
    };
};