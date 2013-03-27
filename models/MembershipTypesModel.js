
/**
 * @model Invite
 * @description Mongoose Model to wrap the Mongoose Schema
 */

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('membershiptypes', APP.schemas.membershiptypes.MembershipTypesSchema);

exports.MemberShipType = new modelPrototype.Model(MongooseModel);

/* EOF */