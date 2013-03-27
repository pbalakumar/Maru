
/**
 * @model User
 **/

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('users', APP.schemas.user.UserSchema);

exports.User = new modelPrototype.Model(MongooseModel);

/* EOF */