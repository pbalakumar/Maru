
/*!
 * @list dependencies
 */

var permissions = APP.middlewares.permissions;

/*!
 * @routes GET /dashboard/
 */

APP.get('/payments/all/', permissions.checkLogged, permissions.checkAdmin, function(request, response, next) {
  var findAllPaymentsPromise = APP.services.payment.findAll(request.session);
  findAllPaymentsPromise.then(function(payments) {
    response.json(payments);
  }, function(error) {
    response.send(error);
  });
});

/* EOF */