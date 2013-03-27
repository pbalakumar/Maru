
/*!
 * @schema EventSchema
 */

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId;

/*!
 * @schema User
 */

var EventSchema = exports.EventSchema = new Schema({
  id          : { type: ObjectId },
  start       : { type: Date, required: true },
  end         : { type: Date, required: true },
  // Maintain State? TBD
  calendar_id : { type: String, required: false },
  paid        : { type: Boolean, default: false },
  cost        : { type: Number },
  title       : { type: String, required: true },
  zone_max    : { type: Number },
  zone_name   : { type: String },
  booked_by   : { type: String },
  facility    : { type: String, default: 'Marucci Elite Houston' },
  recurring   : { type: String, enum: ['daily', 'weekly', 'monthly','single'] },
  zone_type   : { type: String, enum: ['field', 'cage'] },
  _team       : { type : ObjectId, required: true },
  practice    : { type: Boolean, default: false },
  tournament  : { type: Boolean, default: false },
  lesson      : { type: Boolean, default: false },
  updated_at  : { type: Date, default: Date.now },
  created_at  : { type: Date, default: Date.now }
}, { versionKey : false });

EventSchema.pre('save',function(next) { 
  this.updated_at = new Date();
  next(); 
}); 

/* EOF */