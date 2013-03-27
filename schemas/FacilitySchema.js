
/** 
 * @schema FacilitySchema
 **/

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId;

/**
 * @schema User
 **/

var FacilitySchema = exports.FacilitySchema = new Schema({
  id            : { type: ObjectId },
  facility_name : { type: String },
  location      : {
    street_1    : { type: String },
    street_2    : { type: String },
    city        : { type: String },
    state       : { type: String },
    zipcode     : { type: String }
  },
  updated_at  : { type: Date, default: Date.now },
  created_at  : { type: Date, default: Date.now }
}, { versionKey : false });

FacilitySchema.pre('save',function(next) { 
  this.updated_at = new Date();
  next(); 
}); 

/* EOF */