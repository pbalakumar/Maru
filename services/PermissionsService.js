
/*!
 * @service Permissions
 * @description Promise based permissions checking - next piece convert to true ACL bit masks
 */

/*!
 * @method checkLogged
 * @description Checks if User is logged in
 */

exports.checkLogged = function(request) {
  var promise = new APP.Promise();
  if (request.session && request.session.auth && request.session.auth.logged === true) {
    promise.resolve(true);
  } else {
    promise.resolve(false);
  };
  return promise;
};

/*!
 * @method checkAdmin
 * @description Checks if an administrator
 */

exports.checkAdmin = function(request) {
  var promise = new APP.Promise();
  if (request.session.auth.is_admin === true) {
    promise.resolve(true);
  } else {
    promise.resolve(false);
  };
  return promise;
};

/*!
 * @method checkAdmin
 * @description Checks if an administrator
 */

exports.checkResponsibleParty = function(request) {
  var promise = new APP.Promise();
  if (request.session.user.is_responsible_party === true) {
    promise.resolve(true);
  } else {
    promise.resolve(false);
  };
  return promise;
};

/* EOF */