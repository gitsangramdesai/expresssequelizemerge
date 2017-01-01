// get dependencies
var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var multer = require('multer');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var winston = require('winston');
var fs = require('fs');
var dateFormat = require('dateformat');
var Sequelize = require("sequelize");
var Controllers = require('./controllers'); //controllers

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

var env = process.env.NODE_ENV || "development"; //determine enviornment 
var config = require(__dirname + '/config/config.json')[env]; //config for database




var app_setting_provider = require('./load-app-settings');
var appSettings = app_setting_provider.DEFAULTS //parsing config.json file


var sequelize = new Sequelize(config.database, config.username, config.password, config); //sequelize initialization

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/reported_images');
    },
    filename: function (req, file, cb) {
        var extension = file.mimetype;
        extension = extension.split('/');
        extension = extension[1];
        cb(null, Date.now() + "." + extension);
    }
});
app.use(multer({
    dest: './uploads/',
    storage: storage,
    fileFilter: function (req, file, cb) {
        cb(null, true);
    }
}).any());


app.use(function (req, res, next) {
    console.log(req.url);
    if (typeof req.files == "undefined") {
        req.files = [];
    }
    for (var i = 0; i < req.files.length; i++) {
        req[req.files[i]['fieldname']] = {};
        req[req.files[i]['fieldname']] = req.files[i];
    }

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



var passport = require('./config/Passport.js')(app);
var routes = require('./routes/routes.js')(app, passport, Controllers);

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

var accessLogStream = fs.createWriteStream(accessLogFilename, { flags: 'a' });
app.use(morgan('combined', { 'stream': accessLogStream })); //attach default logger

app.use(bodyParser.urlencoded(
    {
        extended: true
    }
)); //application/x-www-form-urlencoded
app.use(bodyParser.json());

app.use('/api/', routes); //mount routes to mount point api(/api) instead of root(/)
app.use('/static', express.static('public')); //hosting static files

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