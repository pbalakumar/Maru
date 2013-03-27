
/**
 * @model Sale
 **/

var modelPrototype = require('./prototype.js')
  , MongooseModel = APP.mongo.model('payments', APP.schemas.payments.PaymentSchema);

exports.Payment = new modelPrototype.Model(MongooseModel);

/* EOF */