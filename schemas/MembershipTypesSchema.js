
/** 
 * @schema MembershipTypes
 **/

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId
  , options = { versionKey : false }

/**
 * @schema User
 **/

var MembershipTypesSchema = exports.MembershipTypesSchema = new Schema({
  id            : { type: ObjectId },
  name          : { type: String, required: true, trim: true },
  price         : { type: Number, required: true },
  zones_allowed : { type: Array, required: true },
  recurring     : { type: String, default: 'single', enum: ['single','daily','weekly','monthly'] },
  updated_at    : { type: Date, default: Date.now },
  created_at    : { type: Date, default: Date.now }
}, options);

MembershipTypesSchema.pre('save',function(next) { 
  this.updated_at = new Date();
  next(); 
}); 

/* EOF */