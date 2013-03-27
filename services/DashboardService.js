
/*!
 * @service Dashboard
 * @description Application Dashboard for all users
 */

var Promise = APP.Promise;

/*!
 * @method setEJSLocals
 * @description Set the 
 * @param {Object} request Node.js request object
 * @return {Object} promise Resolved or rejected promise
 */

exports.setEJSLocals = function(session) {
  var promise = new Promise();
  // YO DAWG, IS SESSION PRESENT?
  if (typeof(session) === 'undefined') {
    promise.reject(new Error('Please Login!'), true);
  } else {
    // our custom ejs locals
    var locals = {
      team                 : (session.team !== undefined) ? session.team : {},
      user                 : (session.user !== undefined) ? session.user : {},
      is_player            : (session.user.is_player === true) ? true : false,
      is_owner             : (session.user.is_owner === true) ? true : false,
      is_coach             : (session.user.is_coach) ? true : false,
      is_responsible_party : (session.user.is_responsible_party === true) ? true : false,
    };
    console.log(locals);
    promise.resolve(locals);
  }
  return promise;
};

/* EOF */