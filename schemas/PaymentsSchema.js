
/*!
 * @schema PaymentsSchema
 */

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId
  , options = { versionKey : false };

var PaymentSchema = exports.PaymentSchema = new Schema({
  id          : { type: ObjectId },
  CIM_ID      : { type: String, required: true },
  description : { type: String, required: true, trim: true },
  _user       : { type : ObjectId, required: true },
  updated_at  : { type: Date, default: Date.now },
  created_at  : { type: Date, default: Date.now }
}, options);

PaymentSchema.pre('save',function(next) { 
  this.updated_at = new Date();
  next(); 
}); 
