//do not use .done here

module.exports = function (sequelize) {
    var db = require("../models");
    return {
        get: function (req, res) {
            return db.Language.findAll().then(function (Languages) {
                return Languages;
            }).error(function (err) {
                return null;
            });
        },
        getbyid: function (language) {
            return db.Language.find({
                where: {
                    id: language.id
                }
            }).then(function (language) {
                return language;
            }).error(function (err) {
                return null;
            });
        },
        findorcreate: function (newLanguage) {
            var current_time = new Date();
            return db.Language.findOrCreate({
                where: {
                    name: sequelize.or([newLanguage.name.toUpperCase(), newLanguage.name.toLowerCase()])
                },
                defaults: {
                    name: newLanguage.name,
                    user_id: newLanguage.user_id,
                    created_at:newLanguage.created_at,
                    updated_at:newLanguage.updated_at
                }
            }).spread(function (user, created) {
                if (created) {
                    return { status: true, message: 'OK', error: null };
                } else {
                    return { status: false, message: "Language already exist", error: null };
                }
            }).error(function (err) {
                return { status: false, message: err.message, error: err };
            });
        },
         Delete: function (language) {
            return db.Language.find({
                where: {
                    id: language.id
                }
            }).then(function (language) {
                return language.destroy();
            }).error(function (err) {
                return null;
            });
        },
         MarkAsDelete: function (newLanguage) {
             var current_time = new Date();
             return db.Language.find({
                 where: {
                     id: newLanguage.id
                 }
             }).then(function (language) {
                 if(language){
                    return language.updateAttributes({
                                        deleted_at: current_time
                             })
                 }else{
                     return language
                 }
             }).error(function (err) {
                 return null;
             });
         },
         Update: function (newLanguage) {
             var current_time = new Date();
             return db.Language.find({
                 where: {
                     id: newLanguage.id
                 }
             }).then(function (language) {
                 if(language){
                    return language.updateAttributes({
                                        updated_at: current_time,
                                        name:newLanguage.name
                             })
                 }else{
                     
                     return language
                 }
             }).error(function (err) {
                 return null;
             });
         }
    };
};