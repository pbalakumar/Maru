
/*!
 * @service User
 * @description User related Services? :P
 */

var Promise = APP.Promise
  , util = require('util')
  , uuid = require('node-uuid')
  , UserModel = APP.models.users.User
  , TeamModel = APP.models.teams.Team;

/*!
 * @method setSession
 * @param {Object} request
 * @param {Object} user User Mongo Object
 * @description sets session data for users and finds role
 */

exports.setSession = function setSession(params) {
  var promise = new Promise();
  var user = params.user
    , request = params.request;
  if (user.password) {
    delete user.password;
  };
  try {
    // session auth
    request.session.auth = {
      logged     : true,
      user       : {
        id       : user._id,
        email    : user.email,
        is_admin : user.is_admin
      }
    };
    // Session notifications
    request.session.notifications = request.session.notifications || [];
    // Session user minus password although salted/hashed
    request.session.user = user;
    // Attach Team Information to Session
    var query = { $or: [
      { _owners : { $in: [user._id] } },
      { _coaches : { $in: [user._id] } },
      { _players : { $in: [user._id] } },
      { _responsible_parties : { $in: [user._id] } }
    ]};
    var findTeamPromise = TeamModel.findOne(query);
    findTeamPromise.then(function(team) {
      request.session.team = team;
      // Resolve with user and current request state
      promise.resolve({
        user    : user,
        team    : team,
        request : request
      });
    }, function(error) {
      promise.reject(error, true);
    });
  } catch (error) {
    promise.reject(error, true);
  };
  return promise;
};

/*!
 * @method login
 * @param {Object} data Contains email and password fields
 * @description Tries to login user and set their session
 */

exports.login = function(request) {
  var promise = new Promise();
  var password = request.body.password;
  var query = { 
    email    : request.body.email, 
    password : APP.helpers.general.encryptPass(password)
  };
  var findOnePromise = UserModel.findOne(query);
  findOnePromise.then(function(user) {
    if (user !== null && user._id) {
      var sessionPromise = APP.services.user.setSession({ user : user, request : request });
      sessionPromise.then(function(params) {
        promise.resolve(params.user);
      }, function(error) {
        promise.reject(error, true);
      });
    } else { 
      promise.reject({
        message : 'Invalid Login',
        code    : 403
      }, true);
    };
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method createUser
 */

exports.createUser = function createUser(request, data) {
  var promise = new Promise();
  // generic user info for all users
  var user = {
    profile: {
      firstname         : data.firstname, 
      lastname          : data.lastname, 
    },
    email               : data.email, 
    password            : data.password,
    last_login          : new Date(),
    verified_email_uuid : uuid.v1()
  };
  // coach or player
  if (data['user-type'] === 'owner') {
    user.is_owner = true;
    user['needs_team_setup'] = true;
  // player check
  } else if (data['user-type'] === 'player') {
    user.is_player = true;
    user['needs_profile_setup'] = true;
  };
  // execute promise
  var insertPromise = UserModel.create(user);
  insertPromise.then(function(resultingUser) {
    promise.resolve({
      user    : resultingUser,
      request : request
    });
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method emailEmailConfirmationLetter
 */

exports.emailEmailConfirmationLetter = function emailEmailConfirmationLetter(params) {
  var user = params.user
    , request = params.request
    , promise = new Promise()
    , verifiedEmailUUID = user.verified_email_uuid
  var mailerOptions = { 
    to       : user.email,
    template : 'welcome',
    subject  : 'Welcome to Marucci Elite! Please confirm your email address',
    variables: {
      name                : user.profile.firstname,
      email               : user.email,
      verified_email_uuid : verifiedEmailUUID,
    }
  };
  var emailPromise = APP.helpers.mailer.send(mailerOptions);
  emailPromise.then(function() {
    promise.resolve({
      user    : user,
      request : request
    });
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method confirm
 * @description Confirm Email
 */

exports.confirm = function confirm(request) {
  var promise = new Promise();
  var query = {
    email               : request.params.email,
    verified_email_uuid : request.params.hash
  };
  var params = {
    verified_email : true
  };
  var updatePromise = UserModel.update(query, params);
  updatePromise.then(function() {
    promise.resolve();
  }, function(error) {
    APP.helpers.logger.error(error);
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method countActiveUsers
 */

exports.countActiveUsers = function countActiveUsers() {
  var query = { 
    last_login: { $gte : APP.helpers.general.daysAgo(30) }
  };
  return UserModel.count(query);
};

/*!
 * @method updateUserPasswordResetHash
 */

exports.updateUserPasswordResetHash = function updateUserPasswordResetHash(user) {
  var promise = new Promise();
  if (user === null || !user._id) {
    promise.reject({
      message : 'User not Found',
      code : 404
    }, true);
  } else {
    var randomHash = APP.helpers.general.randomHash();         
    var resetURL = APP.config.baseUrl  + 'user/forgot-password/' + user.email + '/' + randomHash + '/';
    var query = { _id: user._id };
    var params = {
      pass_reset_hash: randomHash
    };
    var updatePromise = UserModel.update(query, params);
    updatePromise.then(function() {
      promise.resolve({
        user: user,
        resetURL : resetURL
      });
    }, function(error) {
      promise.reject(error, true);
    });
  };
  return promise;
};

/*!
 * @method resetPassword
 */

exports.initiatePasswordReset = function initiatePasswordReset(request) {
  var promise = new Promise();
  var email = request.body.email;
  if ((email === '') || (!APP.helpers.general.isEmail(email))) {
    promise.reject({
      code: 500,
      message: 'Please enter a valid email.'
    }, true);
  } else {
    var actions = [];
    actions.push(function() {
      return UserModel.findOne({ email: email });
    });
    actions.push(function(user) {
      return APP.services.user.updateUserPasswordResetHash(user);
    });
    actions.push(function(params) {
      var user = params.user;
      var resetURL = params.resetURL;
      var mailerOptions = { 
        to: email, 
        template:'passreset',
        subject: 'Password reset',
        variables: {
          reset_url: resetURL
        }
      };
      return APP.helpers.mailer.send(mailerOptions);
    });
    // sequence through promises
    APP.promise.seq(actions).then(function() {
      promise.resolve();
    }, function(error) {
      promise.reject(error, true);
    });
  };
  return promise;
};

/*!
 * @method updatePassword
 * @description Update users password
 */

exports.updatePassword = function updatePassword(request, response) {
  var promise = new Promise();
  var data = {
    password  : request.body.password,
    password2 : request.body.password2,
    email     : request.session.email,
    hash      : request.session.hash
  };
  if (data.password !== data.password2) {
    promise.reject({
      code    : 500,
      message : 'Password and Password Confirm must match!'
    }, true);
  } else if (!APP.helpers.general.isPassword(data.password)) {
    promise.reject({
      code    : 500,
      message : 'Invalid Password Selection!'
    }, true);
  } else {
    // seq of promises
    var actions = [];
    // continue, data checks out so far
    var query = { 
      email: data.email,
      pass_reset_hash: data.hash
    }; 
    actions.push(function() {
      return UserModel.findOne(query);
    });
    actions.push(function(user) {
      var returnPromise = new APP.Promise();
      if (user !== null && user._id) {
        var query = { _id: user._id };
        var params = { 
          password: APP.helpers.general.encryptPass(data.password)
        };
        var updatePromise = UserModel.update(query, params);
        updatePromise.then(function() {
          returnPromise.resolve();
        }, function(error) {
          returnPromise.reject(error, true);
        });
      } else {
        returnPromise.reject({
          code    : 404,
          message : 'User Not Found!'
        }, true);
      };
      return returnPromise;
    });
    // sequence through promises
    APP.promise.seq(actions).then(function() {
      promise.resolve();
    }, function(error) {
      promise.reject(error, true);
    });
  };
  return promise;
};

/*!
 * @method register
 */

exports.register = function register(request, data) {
  var promise = new Promise();
  var actions = [];
  // player invited to team
  if (data.team_id) {
    actions.push(function() {
      return APP.services.user.createUser(request, data);
    });
    actions.push(function(params) {
      params.team = {
        _id : data.team_id
      };
    });
    actions.push(APP.services.user.emailEmailConfirmationLetter);
    actions.push(function(params) {
      params.type = data['user-type'];
      return APP.services.team.attachUserToTeam(params);
    });
    actions.push(APP.services.user.setSession);
  // player or coach, uninvited
  } else {
    actions.push(function() {
      return APP.services.user.createUser(request, data);
    });
    actions.push(APP.services.user.emailEmailConfirmationLetter);
    actions.push(APP.services.user.setSession);
  }
  // Sequence through promises
  APP.promise.seq(actions).then(function(user) {
    APP.helpers.logger.log('Created user: ' + user.email);
    promise.resolve(user);
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method updateUser
 * @description Updates a User Collection Item
 */

exports.updateUser = function updateUser(request, userId, updates) {
  var promise = new Promise();
  var query = { _id : userId };
  // adjust update
  updates['needs_profile_setup'] = false;
  updates['needs_team_setup'] = false;
  var updateUserPromise = UserModel.update(query, updates);
  updateUserPromise.then(function(rowsAffected) {
    APP.helpers.logger.log('Updated Users: ' + rowsAffected);
    // fix session
    request.session.user['needs_profile_setup'] = false;
    request.session.user['needs_team_setup'] = false;
    promise.resolve(rowsAffected);
  }, function(error) {
    APP.helpers.logger.error(error);
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method deleteUser
 * @descripton Delete a user, and remove them from a Team
 * @param {String} userId ObjectId of User
 * @param {String} teamId ObjectId of Team that User is a member of
 * @return {Object} promise Promise to resolve or reject
 */

exports.deleteUser = function(request, userId, teamId) {
  var promise = new Promise();
  // Current User Check
  if (request.session.user.is_owner === true) {
    promise.reject(new Error('Team Owners cannot DELETE their Accounts!'), true);
  } else if (request.session.user._id.toString() === userId.toString) {
    promise.reject(new Error('You cannot DELETE Yourself from the Team!'), true);
  } else {
    var actions = [];
    // Find User
    var query = { _id : userId };
    // Add .remove() promise to actions sequence
    actions.push(function() {
      return UserModel.remove({ _id : userId })
    });
    // Detach User from Team
    actions.push(function() {
      return APP.services.team.removeUserFromTeam(request, userId, teamId);
    });
    // Sequence through promises
    APP.promise.seq(actions).then(function() {
      APP.helpers.logger.log('Removed User: ' + userId);
      promise.resolve();
    }, function(error) {
      promise.reject(error, true);
    });
  };
  return promise;
};

/* EOF */