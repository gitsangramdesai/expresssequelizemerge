var gulp = require('gulp');
var gulpZip = require('gulp-zip');
var del = require("del");
var zip = require("gulp-zip");
var clean = require('gulp-clean');
var dateFormat = require('dateformat');

var zipFileName = dateFormat((new Date()), "yyyymmdd");

console.log("spare todays log file access_" + zipFileName + '.log');

//task ziplogs & logcleanup should be called sequentially
gulp.task('ziplogs', function () {
    return  gulp.src([
        'logs/access/**/*.log',
        '!logs/access/access_'+ zipFileName + '.log'
        ])
        .pipe(zip(zipFileName+'.zip'))
        .pipe(gulp.dest('./backup'));
});

//it requires ziplogs task to be completed
gulp.task('logcleanup', ['ziplogs'], function () {
   return del([
    'logs/access/**/*.log',
    '!logs/access/access_'+ zipFileName + '.log'
  ]);
});

gulp.task('default', ['ziplogs','logcleanup']);