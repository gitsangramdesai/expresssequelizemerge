"use strict";

var fs = require("fs");
var path = require("path");
var cntrlr = {};

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var controller = require(path.join(__dirname, file));
        var filname = file.split(".")[0].replace('Controller','');
        cntrlr[filname] = controller;
    });
module.exports = cntrlr;