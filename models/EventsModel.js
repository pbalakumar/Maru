
/**
 * @model Team
 **/

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('events', APP.schemas.event.EventSchema);

exports.Event = new modelPrototype.Model(MongooseModel);

/* EOF */