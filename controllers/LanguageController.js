var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var languageService = require("../services/languageService")(sequelize);


exports.Index = function (req, res) {
    languageService.get(req, res).then(function (results) {
        res.send(results);
    }).done();
};

// api/project 
exports.Create = function (req, res) {
    var current_date = new Date();
    var newLanguage = {
        name: req.body.name,
        user_id: 1,
        created_at:current_date,
        updated_at:current_date
    };
    languageService.findorcreate(newLanguage).then(function (result) {
        res.send(result);
    }).done();
};


exports.Delete = function (req, res) {
    var newLanguage = {
        id: req.params.id,
    };
    languageService.Delete(newLanguage).then(function (result) {
        res.send(result);
    }).done();
};

exports.MarkAsDelete = function (req, res) {
    var newLanguage = {
        id: req.body.id,
    };
    languageService.MarkAsDelete(newLanguage).then(function (result) {
        res.send(result);
    }).done();
};

exports.Update = function (req, res) {
    var newLanguage = {
        id: req.body.id,
        name:req.body.name
    };
    languageService.Update(newLanguage).then(function (result) {
        res.send(result);
    }).done();
};

exports.GetById = function (req, res) {
    var newLanguage = {
        id: req.params.id
    };
    languageService.getbyid(newLanguage).then(function (result) {
        res.send(result);
    }).done();
};