
/*!
 * @method index
 */

APP.get('/', function(request, response, next) {
  var checkLoggedPromise = APP.services.permissions.checkLogged(request);
  checkLoggedPromise.then(function(result) {
    if (result === true) {
      response.redirect('/dashboard/');
    } else {
      response.redirect('/user/register/');
    };
  }, function(error) {
    APP.helpers.logger.error(error);
    response.redirect('/user/register/');
  });
});

/* EOF */