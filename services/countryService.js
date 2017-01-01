//do not use .done here

module.exports = function (sequelize) {
    var db = require("../models");
    return {
        get: function (req, res) {
            return db.Country.findAll().then(function (Countrys) {
                return Countrys;
            }).error(function (err) {
                return null;
            });
        },
        getbyid: function (country) {
            return db.Country.find({
                where: {
                    id: country.id
                }
            }).then(function (country) {
                return country;
            }).error(function (err) {
                return null;
            });
        },
        findorcreate: function (newCountry) {
            var current_time = new Date();
            return db.Country.findOrCreate({
                where: {
                    name: sequelize.or([newCountry.name.toUpperCase(), newCountry.name.toLowerCase()])
                },
                defaults: {
                    name: newCountry.name,
                    user_id: newCountry.user_id,
                    created_at:newCountry.created_at,
                    updated_at:newCountry.updated_at
                }
            }).spread(function (user, created) {
                if (created) {
                    return { status: true, message: 'OK', error: null };
                } else {
                    return { status: false, message: "Country already exist", error: null };
                }
            }).error(function (err) {
                return { status: false, message: err.message, error: err };
            });
        },
         Delete: function (country) {
            return db.Country.find({
                where: {
                    id: country.id
                }
            }).then(function (country) {
                return country.destroy();
            }).error(function (err) {
                return null;
            });
        },
         MarkAsDelete: function (newCountry) {
             var current_time = new Date();
             return db.Country.find({
                 where: {
                     id: newCountry.id
                 }
             }).then(function (country) {
                 if(country){
                    return country.updateAttributes({
                                        deleted_at: current_time
                             })
                 }else{
                     return country
                 }
             }).error(function (err) {
                 return null;
             });
         },
         Update: function (newCountry) {
             var current_time = new Date();
             return db.Country.find({
                 where: {
                     id: newCountry.id
                 }
             }).then(function (country) {
                 if(country){
                    return country.updateAttributes({
                                        updated_at: current_time,
                                        name:newCountry.name
                             })
                 }else{
                     
                     return country
                 }
             }).error(function (err) {
                 return null;
             });
         }
    };
};