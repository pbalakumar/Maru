
/*!
 * @description Main Application File
 */
var express = require('express');
var fs = require('fs')
  , engine = require('ejs-locals')
  , promise = require('node-promise')
  , connectMongoose = require('connect-mongoose')
  , sessionStore = require('connect-mongoose')(express);

/*!
 * @description http.Server
 */

global.APP = express();

// Attach promise for easy referencing
APP.Promise = promise.Promise;
APP.promise = promise;

// Setup objects for loading
APP.models = {};
APP.schemas = {};
APP.helpers = {};
APP.services = {};
APP.middlewares = {};
APP.controllers = {};

// General Site Config
APP.config = require('./config/config')();

// Setup Mongoose
APP.mongo = require('mongoose');

// Use redis localhost for development
APP.configure(function() {
  APP.use(express.logger('tiny'));
  APP.use(express.static(__dirname + '/public'));
  APP.use(express.methodOverride());
  APP.use(express.bodyParser());
  APP.use(express.cookieParser());
  APP.use(express.session({
    secret : 'ertbgdfzfgb$SA!_',
    maxAge : new Date(Date.now() + 3600000),
    store  : new sessionStore()
  }));
  APP.engine('ejs', engine);
  APP.set('views', __dirname + '/views');
  APP.set('view engine', 'ejs');
  APP.use(APP.router);
});

/*!
 * @description Auto-Load Applicaton Components
 * @return {Object} Instance of http.Server along with:
 * - APP.models.x
 * - APP.helpers.x
 * - APP.schemas.x
 * - APP.services.x
 */

(function(directories) {
  directories.map(function(directory) {
    var files = fs.readdirSync('./' + directory);
    // alphabetize, important.
    files.sort(function(a, b) {
      return a < b;
    });
    files.map(function(file) {
      if (/\.js$/.test(file)) {
        var name = file.toLowerCase();
        var required = './' + directory + '/' + file;
        var type = directory.substr(0, directory.length - 1);
        var item = name.replace(type + '.js', '');
        try {
          APP[directory][item] = require(required);
        } catch (error) {
          console.error('name:', name);
          console.error('item:', item);
          console.error('type:', type);
          console.error('required:', required);
          console.error(error);
          // dealbreaker.
          throw new Error(error);
        };
      };
    });
  });
})(['helpers','schemas','models','services','middlewares','controllers']);

/*!
 * @description mongodb
 */

APP.mongo.connect(APP.config.mongoDB).connection.on('open', function() {
  APP.helpers.logger.log('MongoDB, Connected!');
  APP.mongo.set('debug', true);
}).on('error', function(error) {
  APP.helpers.logger.error({ mongoDB : APP.config.mongoDB });
  APP.helpers.logger.error(error);
});

/*!
 * @description node.js server .listen()
 */

APP.listen(APP.config.port, function() {
  APP.helpers.logger.log('Server started in "' + process.env.NODE_ENV + '" on port ' + APP.config.port);
});

/* EOF */