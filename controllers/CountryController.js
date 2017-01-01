var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var countryService = require("../services/countryService")(sequelize);


exports.Index = function (req, res) {
    countryService.get(req, res).then(function (results) {
        res.send(results);
    }).done();
};

// api/project 
exports.Create = function (req, res) {
    console.log('**' + JSON.stringify(req.body));

    var current_date = new Date();
    var newCountry = {
        name: req.body.name,
        user_id: 1,
        created_at:current_date,
        updated_at:current_date
    };
    countryService.findorcreate(newCountry).then(function (result) {
        res.send(result);
    }).done();
};


exports.Delete = function (req, res) {
    var newCountry = {
        id: req.params.id,
    };
    countryService.Delete(newCountry).then(function (result) {
        res.send(result);
    }).done();
};

exports.MarkAsDelete = function (req, res) {
    var newCountry = {
        id: req.body.id,
    };
    countryService.MarkAsDelete(newCountry).then(function (result) {
        res.send(result);
    }).done();
};

exports.Update = function (req, res) {
    var newCountry = {
        id: req.body.id,
        name:req.body.name
    };
    countryService.Update(newCountry).then(function (result) {
        res.send(result);
    }).done();
};

exports.GetById = function (req, res) {
    var newCountry = {
        id: req.params.id
    };
    countryService.getbyid(newCountry).then(function (result) {
        res.send(result);
    }).done();
};