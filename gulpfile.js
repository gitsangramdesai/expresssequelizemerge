var gulp = require('gulp');
var del = require("del");
var zip = require("gulp-zip");
var dateFormat = require('dateformat');
var fs = require('fs');
var zipFileName = dateFormat((new Date()), "yyyymmdd");

//create log directories
gulp.task('createLogDir', function () {
    if (!fs.existsSync('./logs/access/')) {
        fs.mkdirSync('./logs/access/');
    }
     if (!fs.existsSync('./logs/info/')) {
        fs.mkdirSync('./logs/info/');
    }
     if (!fs.existsSync('./logs/error/')) {
        fs.mkdirSync('./logs/error/');
    }
});

//task ziplogs & logcleanup should be called sequentially
gulp.task('ziplogs', ['createLogDir'], function () {
    return gulp.src([
        'logs/access/**/*.log',
        '!logs/access/access_' + zipFileName + '.log'
    ])
        .pipe(zip(zipFileName + '.zip'))
        .pipe(gulp.dest('./backup'));
});

//it requires ziplogs task to be completed
gulp.task('logcleanup', ['ziplogs'], function () {
    return del([
        'logs/access/**/*.log',
        '!logs/access/access_' + zipFileName + '.log'
    ]);
});

gulp.task('default', ['createLogDir','ziplogs', 'logcleanup']);
//gulp.task('default', ['createLogDir']);