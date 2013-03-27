
/*!
 * @list dependencies
 */

var permissions = APP.middlewares.permissions;

/*!
 * @route /invite/new/:type/
 * @description Create an invite
 * | /:type/ :
 * |--------- coach
 * |--------- player
 * |--------- responsible_party
 */

APP.post('/invite/new/:type/:teamId/', permissions.checkLogged, function(request, response, next) {
  // what type of user?
  var inviteType = request.params.type
    , teamId = request.params.teamId;
  // multiple players?
  if (inviteType === 'players') {
    var createMultiplePlayerInvitesPromise = APP.services.invite.createMultiplePlayerInvites(request.body, teamId);
    createMultiplePlayerInvitesPromise.then(function() {
      response.json({ success : true });
    }, function(error) {
      response.json({ error : error.message });
    });
  // single player, coach, or responsible party
  } else {
    var newInvitePromise = APP.services.invite.createInvite(request.body, inviteType, teamId);
    newInvitePromise.then(function() {
      response.json({ success : true });
    }, function(error) {
      response.json({ error : error.message });
    });
  };
});

/*!
 * @route /invites/all/
 * @description setup invite view data. invites and roles available
 */

APP.get('/invites/all/', permissions.checkLogged, function(request, response, next) {
  var invitesPromise = APP.services.invite.findAllInvites(request);
  invitesPromise.then(function(invites) {
    response.json(invites);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route /invite/update/:id/
 * @description Update an Invite
 */

APP.post('/invite/update/:id/', function(request, response, next) {
  var updatePromise = APP.services.invite.updateInvite(request);
  updatePromise.then(function(invite) {
    response.json(invite);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route /invite/delete/:id/
 * @description Delete an Invite
 */

APP.del('/invite/delete/:id/', function(request, response, next) {
  // Invite ObjectId
  var deletePromise = APP.services.invite.deleteInvite(request, id);
  deletePromise.then(function() {
    response.json({ success : true });
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route /invite/use/:id/
 * @description use invite
 */

APP.get('/invite/use/:code/', function(request, response, next) {
  // users invite code
  var inviteCode = request.params.code;
  // mark used
  var markUsedPromise = APP.services.invite.useInvite(request, inviteCode);
  // Execute promise and Resolve or reject the promise
  markUsedPromise.then(function(inviteSession) {
    // set invite session
    request.session.invited = inviteSession;
    // redirect to be able to complete profile signup
    response.redirect('/user/register/');
  }, function(error) {
    response.redirect('/user/register/');
  })
});

/* EOF */