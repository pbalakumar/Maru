
/**
 * @list dependencies
 **/

var Promise = APP.Promise
  , ObjectId = APP.mongo.Types.ObjectId

/**
 * @prototype Model
 * @description All models are protypes of this class
 **/

exports.Model = function(mongooseModel) {
  this.baseModel = mongooseModel;
};

/**
 * @method create
 **/

exports.Model.prototype.create = function create(document) {
  var that = this
    , promise = new Promise();
  this.baseModel.create(document, function(error, data) {
    if (error) {
      APP.helpers.logger.error(error);
      if (error.message && error.message.match(/E11000/i)) {
        if (document.email) {
          var errorReturn = {
            code    : 409,
            error   : error,
            message : 'Email Address Already in Use!'
          };
        } else {
          var errorReturn = {
            code    : 409,
            error   : error,
            message : 'Duplicate Key Error!'
          };
        };
      } else {
        var errorReturn = {
          code    : 400,
          error   : error,
          message : 'Validation error!'
        };
      };
      promise.reject(errorReturn, true);
    } else {
      promise.resolve(data);
    };
  });
  return promise;
};

/**
 * @method find
 **/

exports.Model.prototype.find = function find(query) {
  var promise = new Promise();
  this.baseModel.find(query, function(error, data) {
    if (error) {
      promise.reject({
        code    : 500,
        error   : error,
        message : 'Model Find Error'
      }, true);
    } else {
      promise.resolve(data);
    };
  });
  return promise; 
};

/**
 * @method fineOne
 **/

exports.Model.prototype.findOne = function findOne(query, fields, options) {
  var promise = new Promise();
  this.baseModel.findOne(query, fields, options, function(error, data) {
    if (error) {
      promise.reject({
        code    : 500,
        args    : query,
        error   : error,
        message : error.message
      }, true);
    } else {
      promise.resolve(data);
    };
  });
  return promise;
};

/**
 * @method findById
 **/

exports.Model.prototype.findById = function findOne(id) {
  var promise = new Promise();
  this.baseModel.findById(id, function(error, item) {
    if (error) {
      promise.reject({
        code    : 500,
        error   : error,
        message : error.message
      }, true);
    } else {
      promise.resolve(item);
    };
  });
  return promise;
};

/**
 * @method remove
 **/

exports.Model.prototype.remove = function remove(conditions) {
  var promise = new Promise();
  this.baseModel.remove(conditions, function(error) {
    if (error) {
      promise.reject({
        code: 500,
        error: error,
        message: 'Invalid arguments'
      });
    } else {
      promise.resolve();
    };
  });
  return promise;
};

/**
 * @method update
 **/

exports.Model.prototype.update = function update(query, document, options) {
  var that = this
    , promise = new Promise()
    , args = Array.prototype.slice.call(arguments, 0);
  this.baseModel.update(query, document, function(error, affected) {
    if (error) {
      promise.reject(error, true);
    } else {
      if (affected === 0) {
        promise.reject({
          code    : 500,
          message : 'MongoDB - Cannot find Document!'
        });
      } else {
        promise.resolve();
      };
    };
  });
  return promise;
};

/**
 * @method populate
 * @param {Object} query findOne query
 * @param {String} field Field to populate from
 * @return {Object} promise Promise to resolve or reject
 **/

exports.Model.prototype.populate = function populate(query, field) {
  var promise = new Promise();
  this.baseModel.findOne(query).populate(field).exec(function(error, data) {
    if (error) {
      promise.reject({
        code    : 500,
        args    : query,
        error   : error,
        message : 'MongoDB - Data Population Error!'
      }, true);
    } else {
      promise.resolve(data);
    }
  });
  return promise;
};

/**
 * @method count
 **/

exports.Model.prototype.count = function count(query) {
  query = query || {};
  var promise = new Promise();
  this.baseModel.count(query, function(error, data) {
    if (error) {
      promise.reject({
        code    : 500,
        args    : query,
        error   : error,
        message : 'MongoDB Count Error'
      }, true);
    } else {
      promise.resolve(data);
    };
  });
  return promise;
};

/**
 * @method removeEmbeddedDocument
 **/

exports.Model.prototype.removeEmbeddedDocument = function(parentDocumentId, embeddedDocumentId, field) {
  var promise = new Promise();
  // First find the Team
  this.baseModel.findById(parentDocumentId, function(error, result) {
    if (error) {
      promise.reject(error, true);
    } else {
      // Pull the ID out of the _ref
      result[field].pull(embeddedDocumentId);
      // Save the Updated Document
      result.save(function(error, result) {
        if (error) {
          promise.reject(error, true);
        } else {
          promise.resolve(result);
        }
      });
    };
  });
  return promise;
};

/* EOF */