
/*!
 * @schema UserSchema
 */

var Schema = APP.mongo.Schema
  , ObjectId = Schema.ObjectId
  , options = { versionKey : false };

/*!
 * @schema UserSchema
 */

var UserSchema = exports.UserSchema = new Schema({
  id                                : { type: ObjectId },
  email                             : { type: String, required: true, trim: true, unique: true, lowercase: true },
  password                          : { type: String, trim: true, set: APP.helpers.general.encryptPass },
  is_admin                          : { type: Boolean, default: false },
  profile : {
    firstname                       : { type: String, trim: true },
    lastname                        : { type: String, trim: true },
    dob                             : { type: Date }
  },
  location : {
    street_1                        : { type: String, trim: true },
    street_2                        : { type: String, trim: true },
    city                            : { type: String, trim: true },
    state                           : { type: String, trim: true },
    zipcode                         : { type: String, trim: true }
  },
  needs_profile_setup               : { type: Boolean, default: false },
  needs_team_setup                  : { type: Boolean, default: false },
  verified_email                    : { type: Boolean, default: false },
  verified_email_uuid               : { type: String, default: null },
  email_subscribe                   : { type: Boolean, default: true },
  pass_reset_date                   : { type: Date, default: null },
  pass_reset_hash                   : { type: String, default: null },
  last_login                        : { type: Date },
  is_player                         : { type: Boolean, default: false },
  is_owner                          : { type: Boolean, default: false },
  is_coach                          : { type: Boolean, default: false },
  is_responsible_party              : { type: Boolean, default: false },
  player : {
    team_id                         : { type: ObjectId },
    phone                           : { type: String, trim: true },
    cell_phone                      : { type: String, trim: true }, 
    mother                          : { type: String, trim: true },
    mother_email                    : { type: String, trim: true },
    mother_cell_phone               : { type: String, trim: true },
    father                          : { type: String, trim: true },
    father_email                    : { type: String, trim: true },
    father_cell_phone               : { type: String, trim: true },
    uniform_number                  : { type: String, trim: true },
    position_1                      : { type: String, trim: true },
    position_2                      : { type: String, trim: true },
    school                          : { type: String, trim: true },
    graduation_year                 : { type: String, trim: true },
    date_of_birth                   : { type: String, trim: true },
    height                          : { type: String, trim: true },
    weight                          : { type: String, trim: true },
    batting                         : { type: String, enum: ['left','right','switch'] },
    throwing                        : { type: String, enum: ['left','right','both'] },
    age_group                       : { type: String, trim: true },
    shirt_size                      : { type: String, trim: true },
    hat_size                        : { type: String, trim: true },
    twitter                         : { type: String, trim: true },
    facility_member                 : { type: Boolean, default: false }
  },
  payments : {
    players_share                   : { type: Number, default: 0.00 },
    coaches_share                   : { type: Number, default: 0.00 },
    responsible_party               : { type: String, trim: true },
    facility_member                 : { type: Number, default: 0.00 },
    amount_due_monthly              : { type: Number, default: 0.00 },
    amount_due_up_front             : { type: Number, default: 0.00 },
    player_dues_monthly             : { type: Number, default: 0.00 },
    player_dues_up_front            : { type: Number, default: 0.00 },
    responsible_party_dues_monthly  : { type: Number, default: 0.00 },
    responsible_party_dues_up_front : { type: Number, default: 0.00 },
    responsible_party_dues_paid     : { type: Boolean, default: false },
    product_package_five_hundred    : { type: Boolean, default: false },
    player_dues_paid                : { type: Boolean, default: false },
    last_paid                        : { type: Date }
  },
  // card on file sir?
  authorize_net_cim_id            : { type: String, trim: true },
  // responsible party limited non-profile data
  responsible_party : {
    for_player_id                   : { type: ObjectId }, 
  },
  // coach same per responsible party, however; more like a team owner role
  coach : {
    telephone                       : { type: String, trim: true },
  },
  // document dates
  updated_at                        : { type: Date, default: Date.now },
  created_at                        : { type: Date, default: Date.now }
}, options);

/*!
 * @description Mongoose.js helpers for the User's Schema
 */

UserSchema.path('email').validate(function(value) {
  return APP.helpers.general.isEmail(value);
}, 'email');

UserSchema.pre('save',function(next) { 
  this.updated_at = new Date();
  next(); 
}); 

UserSchema.virtual('profile.age').get(function() {
  return Math.floor(( (new Date() - new Date(this.profile.birthday)) / 1000 / (60 * 60 * 24) ) / 365.25 );
});

/* EOF */