  
/*!
 * @service Invite
 * @description Invitation related services
 */

var Promise = APP.Promise
  , InviteModel = APP.models.invites.Invite;

/*!
 * @method createInvite
 */

exports.createInvite = function(data, inviteType, teamId) {
  var promise = new Promise();
  var actions = [];
  // Create Invitation
  actions.push(function() {
    var inviteData = {
      email       : data.email,
      team_id     : teamId,
      prefilled   : data.prefilled,
      invite_code : APP.helpers.general.randomHash(6),
      invite_type : inviteType
    };
    return InviteModel.create(inviteData);
  });
  // Mail Invitation
  actions.push(function(invite) {
    var mailerOptions = { 
      to: invite.email,
      template : 'invite',
      subject  : 'Invitation to join Marucci Elite',
      variables: {
        email       : invite.email,
        invite_code : invite.invite_code
      }
    };
    return APP.helpers.mailer.send(mailerOptions);
  });
  // Sequence through actions
  APP.promise.seq(actions).then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method createMultiplePlayerInvites
 * @description Non-Sequential promise chain of invites to players to team
 */

exports.createMultiplePlayerInvites = function createMultiplePlayerInvites(data, teamId) {
  var promise = new Promise(), actions = [], players = JSON.parse(data.players);
  // data validity check
  players.map(function(player) {
    actions.push(function() {
      return APP.services.invite.createInvite(player, 'player', teamId);
    });
  });
  // execute non-sequential promise
  APP.promise.seq(actions).then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method updateInvite
 */

exports.updateInvite = function(request) {
  var promise = new Promise();
   var query = { 
    _id : request.params._id
  };
  var updatePromise = InviteModel.update(query, request.body);
  updatePromise.then(function(invite) {
    promise.resolve(invite);
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method useInvite
 */

exports.useInvite = function(request, inviteCode) {
  var promise = new Promise()
    , actions = []
    , inviteSession;
  // First find the Invite
  actions.push(function() {
    return InviteModel.findOne({ invite_code : inviteCode });
  });
  // If found, check for validity and set Invite in Session
  actions.push(function(result) {
    var foundInvitePromise = APP.Promise();
    if (result !== null && result._id) {
      inviteSession = {
        email       : result.email,
        team_id     : result.team_id,
        invite_code : result.invite_code,
        invite_type : result.invite_type
      };
      foundInvitePromise.resolve(result);
    } else {
      foundInvitePromise.reject(new Error('Invalid Invitation Code!'), true);
    };
    return foundInvitePromise;
  });
  // Set Invite to used
  actions.push(function(invite) {
    var updateReturn;
    var query = {
      invite_code : inviteCode,
    };
    var changes = {
      used        : true,
      invite_code : ''
    };
    return InviteModel.update(query, changes);
  });
  // Sequence through actions
  APP.promise.seq(actions).then(function() {
    promise.resolve(inviteSession);
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method deleteInvite
 * @descripton Delete an invite
 */

exports.deleteInvite = function(request, id) {
  var promise = new Promise();
  // Find Invite
  var query = { _id : id };
  // Execute Find Promise
  var removePromise = InviteModel.remove(query);
  removePromise.then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method findAllInvites
 * @param {Object} request Node.js request object
 * @return {Object} promise Resolved or rejected promise
 */

exports.findAllInvites = function(request) {
  var promise = new Promise();
  // Find all Invites
  var findInvitesPromise = InviteModel.find({});
  // Execute Promise
  findInvitesPromise.then(function(invites) {
    promise.resolve(invites);
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/* EOF */