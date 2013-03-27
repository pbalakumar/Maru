
/*!
 * @service Asset
 * @description Serve static processed asset files dynamically
 */

var fs = require('fs')
  , path = require('path');

/*!
 * @method js
 * @description Serve /js/app.js on the fly
 */

exports.js = function() {
  var promise = APP.Promise()
    , concatenatedJavascript = ''
    , __jsdirname = path.normalize(__dirname + '/../public/javascripts');
  // vendored js
  var vendorDependencies = [
    __jsdirname + '/vendor/jquery-1.8.js',
    __jsdirname + '/vendor/jqueryui.js',
    __jsdirname + '/vendor/underscore.js',
    __jsdirname + '/vendor/prettify.js',
    __jsdirname + '/vendor/validate.js',
    __jsdirname + '/vendor/notification.js',
    __jsdirname + '/vendor/notifications.js',
    __jsdirname + '/vendor/bootstrap.js',
    __jsdirname + '/vendor/date.js',
    __jsdirname + '/vendor/jquery.timepicker.min.js',
    __jsdirname + '/vendor/fullcalendar.js',
    __jsdirname + '/vendor/jquery.editable-1.3.3.js'
  ];
  // application js
  var projectDependencies = [
    __jsdirname + '/src/helpers.js',
    __jsdirname + '/src/components/LoginManager.js',
    __jsdirname + '/src/components/DashboardManager.js',
  ];
  // merge dependencies in order
  var applicationDependencies = vendorDependencies.concat(projectDependencies)
  // iterate over files reading them in
  applicationDependencies.map(function(_file) {
    concatenatedJavascript += fs.readFileSync(_file, 'utf8');
  });
  promise.resolve(concatenatedJavascript);
  return promise;
};

/* EOF */