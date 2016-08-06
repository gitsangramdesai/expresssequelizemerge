// get dependencies
var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var fs = require('fs');

//load routes from seperate route file
var routes = require('./routes/routes');
var app_setting_provider = require('./load-app-settings')

var env = process.env.NODE_ENV || "development";

//parsing config.json file
var appSettings = app_setting_provider.DEFAULTS

//config for database
var config = require(__dirname + '/config/config.json')[env];

//sequelize initialization
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var userService = require("./services/userService")(sequelize);
var projectService = require("./services/projectService")(sequelize);


var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//access log
var logfilename =  __dirname + '/logs/' + appSettings.setting.log.access.prefix + '/' +appSettings.setting.log.access.prefix+  appSettings.setting.log.access.seperator +   dateFormat(new Date(), appSettings.setting.log.access.fileformat) + '.log';
var logStream = fs.createWriteStream(logfilename);
logStream.on('error', function(e) { console.error(e); });

//attach logger
app.use(morgan('combined', { stream: logStream }));

//Parses form data from request
app.use(bodyParser());

//mount routes to mount point api(/api) instead of root(/)
app.use('/api/', routes);

//User CRUD operations
app.get("/api/users", userService.get);
app.post("/api/user", userService.create);

//project CRUD operations
app.get("/api/projects", projectService.get);
app.post("/api/project", projectService.create);
app.post("/api/user/projects", projectService.getUserProject);
app.get("/api/projectsummary", projectService.getUserProjectCount);

//sync the model with the database force:true will clean all tables
sequelize.sync({ force: true }).then(function (err) {
  //sequelize.sync().then(function (err) {
  if (typeof err.stack !== 'undefined' && err.stack !== null) {
    console.log(err.stack);
  } else {
    console.log("No Error!");
  }
});

app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404.ejs', { title: '404: Page Not Found', Url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.use(function (err, req, res, next) {
  console.log(err);
  // we may use properties of the error object
  // here and next(err) appropriately, or if

  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);

  // respond with html page
  if (req.accepts('html')) {
    res.render('500.ejs', { title: '500: Internal Server Error', error: err });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Something is broken on our end, email us if this issue persist.');
});

app.listen(5000, function () {
  console.log('App is listening on port 5000!');
});