
/*!
 * @schema TeamSchema
 */

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId
  , options = { versionKey : false };

/*!
 * @schema Team
 */

var TeamSchema = exports.TeamSchema = new Schema({
  id                   : { type: ObjectId },
  team_name            : { type: String, required: true, trim: true },
  street_1             : { type: String, trim: true },
  street_2             : { type: String, trim: true },
  city                 : { type: String, trim: true },
  state                : { type: String, trim: true },
  zipcode              : { type: String, trim: true },
  _owners              : [{ type: ObjectId, ref: 'users' }],
  _players             : [{ type: ObjectId, ref: 'users' }],
  _coaches             : [{ type: ObjectId, ref: 'users' }],
  _responsible_parties : [{ type: ObjectId, ref: 'users' }],
  assistant_coach      : { type: String, trim: true },
  age_group            : { type: String, enum: ['5U','6U','7U','8U','9U','10U','11U','12U','13U','14U','15U','16U','17U','18U'] },
  sancion_bodies       : { type: String, enum: ['Nations','USSSA','Super Series','Triple Crown'] },
  league               : { type: String, enum: [''] },
  tournament           : { type: String, enum: [''] },
  updated_at           : { type: Date, default: Date.now },
  created_at           : { type: Date, default: Date.now }
}, options);

TeamSchema.pre('save',function(next) { 
  this.updated_at = new Date();
  next(); 
}); 

/* EOF */