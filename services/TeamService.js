
/*!
 * @service Team
 * @description Team Service
 */

var Promise = APP.Promise
  , TeamModel = APP.models.teams.Team
  , UserModel = APP.models.users.User;

/*!
 * @method createTeam
 * @descripton Create a new Team
 */

exports.createTeam = function createTeam (request) {
  var promise = new Promise()
    , teamData = request.body.team
    , ownerId = request.body.owner
    , actions = [];
  // insert New Team
  actions.push(function() {
    return TeamModel.create(teamData);
  });
  // attach owner to team
  actions.push(function(team) {
    var params = {
      team    : team,
      type    : 'owner',
      request : request,
      userId  : ownerId
    }
    return APP.services.team.attachUserToTeam(params);
  });
  // Sequence through promises
  APP.promise.seq(actions).then(function(params) {
    promise.resolve(params.team);
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method attachUserToTeam
 * @param {Object} params
 * - type: user type
 * - userId
 */

exports.attachUserToTeam = function attachUserToTeam (params) {
  var update
    , userId = params.userId
    , team = params.team
    , type = params.type
    , request = params.request
    , promise = new Promise();
  // team update search query
  var query = {
    _id : team._id
  };
  // users exist in different arrays on our collection item
  switch (type) {
    case 'player':
      update = {
        $push : {
          _players : userId,
        }
      }
      break;
    case 'coach':
      update = {
        $push : {
          _coaches : userId
        }
      }
      break;
    case 'owner':
      update = {
        $push : {
          _owners : userId
        }
      }
      break;
    case 'responsible_party':
      update = {
        $push : {
          _responsible_parties : userId
        }
      }
      break;
  }
  var updatePromise = TeamModel.update(query, update);
  updatePromise.then(function(rowsAffected) {
    promise.resolve({
      team    : team,
      request : request
    });
  }, function(error) {
    promise.reject(error);
  });
  return promise;
};

/*!
 * @method deleteTeam
 * @descripton Delete a Team
 */

exports.deleteTeam = function deleteTeam (request) {
  var promise = new Promise();
  var query = { _id : request.params._id };
  var removePromise = TeamModel.remove(query);
  removePromise.then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method updateTeam
 */

exports.updateTeam = function updateTeam (request) {
  var promise = new Promise();
   var query = { 
    _id : request.params._id
  }
  var updatePromise = TeamModel.update(query, request.body);
  updatePromise.then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error, true);
  });
  return promise;
};

/*!
 * @method removeUserFromTeam
 * @description Remove a User from a Team _members Ref
 */

exports.removeUserFromTeam = function removeUserFromTeam(request, userId, teamId) {
  var promise = new Promise();
  // Remove Embedded document, in this case a Team Member which is now removed from the users collection
  var updatePromise = TeamModel.removeEmbeddedDocument(teamId, userId, '_members'); 
  updatePromise.then(function() {
    promise.resolve();
  }, function(error) {
    promise.reject(error);
  });
  return promise;
};

/*!
 * @method findTeamMembers
 * @param {Object} request Node.js request object
 * @return {Object} promise Promise to resolve or reject
 */

exports.findAllTeamMembers = function findAllTeamMembers(request) {
  var promise = new Promise();
  // check for _id
  if (request.session.team_id === undefined) {
    promise.resolve({});
  } else {
    var query = { _id : request.session.team._id };
    var findTeamMembersPromise = TeamModel.populate(query, '_members');
    findTeamMembersPromise.then(function(members) {
      promise.resolve(members);
    }, function(error) {
      promise.reject(error, true);
    });
  }
  return promise;
};

/* EOF */