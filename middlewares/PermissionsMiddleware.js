
/*!
 * @description Express/Connect Middleware
 */

var PermissionsService = APP.services.permissions;

/*!
 * @middleware checkLogged
 * @description Checks if User is logged in
 */

exports.checkLogged = function(request, response, next) {
  request.session.notifications = request.session.notifications || [];
  var checkLoggedPromise = PermissionsService.checkLogged(request);
  checkLoggedPromise.then(function(result) {
    if (result === true) {
      next();
    } else if (result === false) {
      request.session.notifications.push({ error : 'Not Logged In' });
      response.redirect('/user/login/');
    } else {
      response.redirect('/user/login/');
      request.session.notifications.push({ error : 'Unknown Permissions Error' });
    };
  }, function(error) {
    request.notifications.push({ error : 'Unknown Permissions Error' });
    response.redirect('/user/login/');
  });
};

/*!
 * @middleware checkAdmin
 * @description Checks if an administrator
 */

exports.checkAdmin = function(request, response, next) {
  request.session.notifications = request.session.notifications || [];
  var checkAdminPromise = PermissionsService.checkAdmin(request);
  checkAdminPromise.then(function(result) {
    if (result === true) {
      next();
    } else if (result === false) {
      request.session.notifications.push({ error : 'Not an Administrator' });
      response.redirect('/');
    } else {
      request.session.notifications.push({ error : 'Unknown Administrator Permissions Error' });
      response.redirect('/');
    };
  }, function(error) {
    request.session.notifications.push({ error : 'Unknown Permissions Error' });
    response.redirect('/');
  });
};

/*!
 * @middleware checkResponsibleParty
 * @description Checks if the current user is a "responsible party", only allowing
 * them access to profile updates.
 */

exports.checkResponsibleParty = function(request, response, next) {
  var checkResponsiblePartyPromise = PermissionsService.checkResponsibleParty(request);
  checkResponsiblePartyPromise.then(function(result) {
    if (result === true) {
      response.redirect('/dashboard/account/responsible-party/');
    } else if (result === false) {
      next();
    } else {
      next();
    };
  }, function(error) {
    response.redirect('/');
  });
};

/* EOF */