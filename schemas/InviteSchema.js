
/** 
 * @schema InviteSchema
 **/

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId;

/**
 * @schema InviteSchema 
 **/

var InviteSchema = exports.InviteSchema = new Schema({
  id          : { type: ObjectId },
  team_id     : { type: ObjectId, required: true },
  email       : { type: String, trim: true, unique: true, required: true },
  invite_code : { type: String, trim: true, required: true },
  invite_type : { type: String, trim: true, required: true },
  prefilled   : { type: String, trim: true },
  used        : { type: Boolean, default: false },
  created_at  : { type: Date, default: Date.now }
}, { versionKey : false });

/* EOF */