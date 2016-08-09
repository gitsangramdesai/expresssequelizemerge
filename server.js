// get dependencies
var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//controllers
var Controllers = require('./Controllers');

//required for logging
var morgan = require('morgan');
var winston = require('winston');
var fs = require('fs');
var dateFormat = require('dateformat');

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

//load routes from seperate route file
var routes = require('./routes/routes');
var app_setting_provider = require('./load-app-settings')

//determine enviornment 
var env = process.env.NODE_ENV || "development";

//parsing config.json file
var appSettings = app_setting_provider.DEFAULTS

//config for database
var config = require(__dirname + '/config/config.json')[env];

//sequelize initialization
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//logger
var accessLogFilename = __dirname + '/logs/' + appSettings.setting.log.access.prefix + '/' + appSettings.setting.log.access.prefix + appSettings.setting.log.access.seperator + dateFormat(new Date(), appSettings.setting.log.access.fileformat) + '.log';
var exceptionLogFilename = __dirname + '/logs/' + "exceptions.log";
var errorLogFilename = __dirname + '/logs/' + appSettings.setting.log.error.prefix + '/' + appSettings.setting.log.error.prefix + appSettings.setting.log.error.seperator + dateFormat(new Date(), appSettings.setting.log.error.fileformat) + '.log';
var infoLogFilename = __dirname + '/logs/' + appSettings.setting.log.info.prefix + '/' + appSettings.setting.log.info.prefix + appSettings.setting.log.info.seperator + dateFormat(new Date(), appSettings.setting.log.info.fileformat) + '.log';
var debugLogFilename = __dirname + '/logs/' + appSettings.setting.log.debug.prefix + '/' + appSettings.setting.log.debug.prefix + appSettings.setting.log.debug.seperator + dateFormat(new Date(), appSettings.setting.log.debug.fileformat) + '.log';

//warning
winstonWarningLogger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            level: 'warn', // Only write logs of warn level or higher
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: exceptionLogFilename
        })
    ]
});

//error
winstonErrorLogger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: errorLogFilename,
            maxsize: 1024 * 1024 * 10 // 10MB
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: exceptionLogFilename
        })
    ]
});

//Info
winstonInfoLogger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: infoLogFilename,
            maxsize: 1024 * 1024 * 10 // 10MB
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: exceptionLogFilename
        })
    ]
});

//debug
winstonDebugLogger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: debugLogFilename,
            maxsize: 1024 * 1024 * 10 // 10MB
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: exceptionLogFilename
        })
    ]
});

var accessLogStream = fs.createWriteStream(accessLogFilename,{flags: 'a'});
app.use(morgan('combined', { 'stream': accessLogStream }));//attach default logger
app.use(bodyParser());
app.use('/api/', routes);//mount routes to mount point api(/api) instead of root(/)

//Users
app.get('/api/users', Controllers.User.Index);
app.post('/api/user', Controllers.User.Create);

//Projects
app.get('/api/Projects',Controllers.Project.Index);
app.post('/api/project', Controllers.Project.Create);  
app.post('/api/user/projects', Controllers.Project.GetUserProject);
app.get('/api/projects/projectsummary', Controllers.Project.GetUserProjectCount);



//sequelize.sync().then(function (err) {
sequelize.sync({ force: true }).then(function (err) {
    if (typeof err.stack !== 'undefined' && err.stack !== null) {
        console.log(err.stack);
    } else {
        console.log("No Error!");
    }
});

//page not found
app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
        res.render('404.ejs', { title: '404: Page Not Found', Url: req.url });
        return;
    }
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }
    res.type('txt').send('Not found');
});

//internal server error
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (req.accepts('html')) {
        res.render('500.ejs', { title: '500: Internal Server Error', error: err });
        return;
    }
    res.type('txt').send('Something is broken on our end, email us if this issue persist.');
});

app.listen(5000, function () {
    winstonInfoLogger.log('info', 'listening started at ' + (new Date).toUTCString());
    console.log('App is listening on port 5000!');
});


process.on('uncaughtException', function (err) {
    console.log('error', (new Date).toUTCString() + ' uncaughtException:' + err.message);
    console.log('error', err.stack);

    winstonErrorLogger.log('error', (new Date).toUTCString() + ' uncaughtException:' + err.message);
    winstonErrorLogger.log('error', JSON.stringify(err.stack));
    //process.exit(1);
})