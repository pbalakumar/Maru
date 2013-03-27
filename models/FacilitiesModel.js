
/**
 * @model Team
 **/

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('facilities', APP.schemas.facility.FacilitySchema);

exports.Facility = new modelPrototype.Model(MongooseModel);

/* EOF */