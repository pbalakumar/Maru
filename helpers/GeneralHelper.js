
/**
 * @class helpers
 * @description Generalized Helpers
 **/

var crypto = require('crypto');

/**
 * @method encryptPass
 * @description Encrypts a password cleartext string,
 * salts it (config file?)
 **/

exports.encryptPass = function(passwd){
  var salt = 'scdfgtnytdgsfadrthtnfgd#$%ASD__+';
  return crypto.createHmac('sha1', salt).update(passwd).digest('hex');
};

/**
 * @method mergeObjects
 * @description Merge Object properties 
 **/

exports.mergeObjects = function(objOne, objTwo) {
  if (objOne instanceof Array) {
    return objOne.concat(objTwo);
  };
  var merge = {}, property;
  for (property in objOne) {
    merge[property] = objOne[property];
  }
  for (property in objTwo) {
    merge[property] = objTwo[property];
  }
  return merge;
};

/**
 * @method isObjectId
 * @description Check if a valid MongoDB ObjectID
 */

exports.isObjectId = function(val) {
  return /^[a-z0-9]{24}$/.test(val);
};

/**
 * @method since
 * @description Prettify date
 **/

exports.since = function(startTime) {
  var threshold = 0
    , units = null
    , delta = new Date() - startTime
    , conversions = {
      millisecond: 1,
      second: 1000,
      minute: 60,
      hour:   60,
      day:    24,
      month:  30,
      year:   12
    };

  if (delta <= threshold + 5000) {
    return 'a moment ago..';
  };
  for (var key in conversions) {
    if (delta < conversions[key]) {
      break;
    } else {
      units = key;
      delta = delta / conversions[key];
    }
  };
  delta = Math.floor(delta);
  if (delta !== 1) {
    units += 's';
  };
  var timeSince = [delta, units].join(' ');
  return timeSince + ' ago..';
};

/**
 * @method isEmail
 * @description Checks if email is in valid format
 **/

exports.isEmail = function(val){
  var regExpression = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  return regExpression.test(val);
};

/**
 * @method isUsername
 * @description Checks if username is in valid format
 **/

exports.isUsername = function(val){
  return /^[A-Za-z0-9_]{3,20}$/.test(val);
};

/**
 * @param isPassword
 * @description Checks if password is in valid format
 **/

exports.isPassword = function(val){
  return /^[A-Za-z0-9_]{5,20}$/.test(val);
};

/**
 * @method encryptPass
 * @description Encrypts a string, well passwords really
 **/

exports.encryptPass = function(passwd){
  var crypto = require('crypto'),
    salt = 'sadfgrth#$#%TRVFDASDEFrge';
  return crypto.createHmac('sha1', salt).update(passwd).digest('hex');
};

/**
 * @method toLower
 * @description Converts a string to lowercase
 **/

exports.toLower = function(val){
  return val.toLowerCase();
};

/**
 * @method randomHash
 * @description Creates a 32 digit random unique id
 **/

exports.randomHash = function(hashLength) {
  var strLength = hashLength || 32, 
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_@',
    randomString = '';
  for (var i = 0; i < strLength; i++) {
    var randomPoz = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(randomPoz,randomPoz+1);
  };
  return randomString;
};

/**
 * @method toAge
 * @description Converts date of birth to age in years
 * @param {String} dob Date of Birth in format 10/02/1984
 **/
 
exports.toAge = function(dob) {
  return Math.floor(( (new Date() - new Date(dob)) / 1000 / (60 * 60 * 24) ) / 365.25 );
};

/**
 * @method logStamp
 * @descripton Generates a time stamp formated for logging
 **/

exports.logStamp = function(now) {
  var day = now.getUTCDate();
  var month = (now.getUTCMonth() + 1);
  var time = now.toUTCString().split(' ')[4];
  var year = now.getUTCFullYear().toString().substr(-2);
  return '[' + time + ' ' + day + '/' + month + '/' + year + ']';
};

/**
 * @method daysAgo
 * @description Grabs a timestamp from x days ago
 **/

exports.daysAgo = function(days) {
  return new Date() - (86400000 * days);
};

/* EOF */