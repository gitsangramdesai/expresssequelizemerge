var fs = require('fs');

function getAppSettings () {
  var data = fs.readFileSync('./config/app.json'),
   options = JSON.parse(data);
   return options
}

module.exports = {DEFAULTS:getAppSettings ()}