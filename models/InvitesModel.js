
/**
 * @model Invite
 * @description Mongoose Model to wrap the Mongoose Schema
 */

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('invites', APP.schemas.invite.InviteSchema);

exports.Invite = new modelPrototype.Model(MongooseModel);

/* EOF */