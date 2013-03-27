
/*!
 * @list dependencies
 */

var Promise = APP.Promise
  , permissions = APP.middlewares.permissions
  , TeamModel = APP.models.teams.Team;

/*!
 * @route /team/:id/members/all/
 * @description List all Teams
 */

APP.get('/team/members/all/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var findTeamMembersPromise = APP.services.team.findAllTeamMembers(request);
  findTeamMembersPromise.then(function(members) {
    response.json(members);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route /team/:id/
 * @description find one team
 */

APP.get('/team/:id/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var id = request.params.id;
  var findPromise = TeamModel.findOne({ _id : id });
  findPromise.then(function(team) {
    response.json(team);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route POST /team/
 * @description create team
 */

APP.post('/team/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  // check for data before handing to the service
  var data = request.body, actions = [];
  if (!data || (!data.owner && !data.team) || (data.team && !data.team.team_name)) {
    response.json({ error : 'Please Fill in All Team Information!' });
  } else {
    var createTeamPromise = APP.services.team.createTeam(request);
    createTeamPromise.then(function(team) {
      response.json(team);
    }, function(error) {
      response.json({ error : error.message });
    });
  }
});

/*!
 * @route /team/update/:id/
 * @description Update a Team
 */

APP.post('/team/update/:id/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var updatePromise = APP.services.team.updateTeam(request);
  updatePromise.then(function(team) {
    response.json(team);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route /team/delete/:id/
 * @description delete a Team
 */

APP.del('/team/delete/:id', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var deletePromise = APP.services.team.deleteTeam(request);
  deletePromise.then(function() {
    response.json({ success : true });
  }, function(error) {
    response.json({ error : error.message });
  });
});

/* EOF */