
/**
 * @model Team
 **/

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('teams', APP.schemas.team.TeamSchema);

exports.Team = new modelPrototype.Model(MongooseModel);

/* EOF */