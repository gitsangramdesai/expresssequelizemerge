var gulp = require('gulp');
var del = require("del");
var zip = require("gulp-zip");
var dateFormat = require('dateformat');
var fs = require('fs');
var zipFileName = dateFormat((new Date()), "yyyymmdd");
var browserSync = require('browser-sync').create();
var Promise = require('bluebird');

//create log directories
gulp.task('createLogDir', function() {
    if (!fs.existsSync('./logs/')) {
        fs.mkdirSync('./logs/');
    }
    if (!fs.existsSync('./logs/access/')) {
        fs.mkdirSync('./logs/access/');
    }
    if (!fs.existsSync('./logs/info/')) {
        fs.mkdirSync('./logs/info/');
    }
    if (!fs.existsSync('./logs/error/')) {
        fs.mkdirSync('./logs/error/');
    }
     if (!fs.existsSync('./logs/exception/')) {
        fs.mkdirSync('./logs/exception/');
    }
});

//task ziplogs & logcleanup should be called sequentially
gulp.task('ziplogs', ['createLogDir'], function() {
    return gulp.src([
            'logs/access/**/*.log',
            '!logs/access/access_' + zipFileName + '.log'
        ])
        .pipe(zip(zipFileName + '.zip'))
        .pipe(gulp.dest('./backup'));
});

//it requires ziplogs task to be completed
gulp.task('logcleanup', ['ziplogs'], function() {
    return del([
        'logs/access/**/*.log',
        '!logs/access/access_' + zipFileName + '.log'
    ]);
});


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        proxy: {
            target: "localhost:5000",
            ws: true
        }
    });
});


gulp.task('watch', function(gulpCallback) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: true, // launch default browser as soon as server is up
        proxy: {
            target: "localhost:5000",
            ws: true
        }
    }, function callback() { // (server is now up)
        gulp.watch(['./css/*'], browserSync.reload); // set up watch to reload browsers when source changes
        gulpCallback(); // notify gulp that this task is done
    });
});


//task ziplogs & logcleanup should be called sequentially
gulp.task('CopyAssets', function() {
    return Promise
        .resolve().then(function() {
            return gulp.src(['./bower_components/bootstrap/dist/**/*'])
                .pipe(gulp.dest('./public/assets/bootstrap'));
        }).then(function() {
            return gulp.src(['./bower_components/bootstrap-table/dist/**/*'])
                .pipe(gulp.dest('./public/assets/bootstrap-table'));
        }).then(function() {
            return gulp.src(['./bower_components/jquery/dist/**/*'])
                .pipe(gulp.dest('./public/assets/jquery'));
        }).then(function() {
            return gulp.src(['./bower_components/bootstrap-editable/src/**/*'])
                .pipe(gulp.dest('./public/assets/bootstrap-editable'));
        }).then(function() {
            return gulp.src(['./bower_components/tableexport.js/dist/**/*'])
                .pipe(gulp.dest('./public/assets/tableexport'));
        });
});

gulp.task('default', ['createLogDir', 'ziplogs', 'logcleanup', 'CopyAssets', 'watch']);