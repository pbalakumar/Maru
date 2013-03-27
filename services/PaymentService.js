
/*!
 * @list dependencies
 */

var Promise = APP.Promise
  , PaymentModel = APP.models.payments.Payment;
  
/*!
 * @method findAll
 * @param {Object} session Users current session
 * @return {Object} promise Promise to resolve or reject
 */

exports.findAll = function(session) {
  var promise = new Promise();
  var findAllPaymentsPromise = PaymentModel.find({});
  findAllPaymentsPromise.then(function(payments) {
    promise.resolve(payments);
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};
