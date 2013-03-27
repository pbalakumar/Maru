
/**
 * @metaphor permissions
 * @description Permissions based middleware shortcut because of apps autloading
 * of items, removing the trailing `s`
 **/

var permissions = APP.middlewares.permissions;

/**
 * @route GET /user/login/
 * @description Render Login
 **/

APP.get('/user/login/', function(request, response, next) {
  response.render('user/index', {
    invited : false
  });
});

/**
 * @route GET /user/register/
 * @description Render Login
 **/

APP.get('/user/register/', function(request, response, next) {
  // Check if the user was invited
  var wasInvited = (request.session && request.session.invited) ? true : false;
  var prefilled = (request.session && request.session.invited && request.session.invited.prefilled) ? JSON.parse(request.session.invited.prefilled) : {};
  var teamId = (prefilled === true) ? request.session.invited.team_id : '';
  var invite = (request.session && request.session.invited) ? request.session.invited : '';
  response.render('user/index', {
    invited   : wasInvited,
    team_id   : teamId,
    prefilled : prefilled,
    invite    : invite
  });
});

/**
 * @route GET /user/forgot-password/
 * @description Render Login
 **/

APP.get('/user/forgot-password/', function(request, response, next) {
  response.render('user/index', {
    invited   : false,
    prefilled : {}
  });
});

/**
 * @route GET /user/reset-password/
 * @description Render Login
 **/

APP.get('/user/reset-password/', function(request, response, next) {
  response.render('user/index', {
    invited   : false,
    prefilled : {}
  });
});

/**
 * @route GET /logout/
 * @description Logs user out 
 **/

APP.get('/user/logout/', function(request, response, next) {
  request.session.destroy(function() {
    response.redirect('/user/register/');
  });
});

/**
 * @route GET /users/all/
 * @description list users
 **/

APP.get('/users/all/', permissions.checkLogged, function(request, response) {
  var findPromise = APP.models.users.User.find({});
  findPromise.then(function(users) {
    response.json(users);
  }, function(error) {
    response.json({ error : error.message });
  });
});

/**
 * @route /confirm
 * @description confirms that user is using a valid email address
 **/

APP.get('/user/confirm-email/:email/:hash/', function(request, response) {
  var promise = APP.services.user.confirm(request);
  promise.then(function() {
    request.session.message = 'Successfully Confirmed your Email Address!';
    response.redirect('/dashboard/');
  }, function(error) {
    request.session.message = 'Error Confirming Email!';
    response.redirect('/');
  });
});

/**
 * @route GET /user/forgot-password/
 * @description let's a user select a new password
 **/

APP.get('/user/forgot-password/:email/:hash/', function(request, response) {
  request.session.email = request.params.email;
  request.session.hash = request.params.hash;
  response.redirect('/user/reset-password/');
});

/*!
 * @method POST doLogin
 * @description lets user login with email, password
 */

APP.post('/user/login/', function(request, response) {
  var loginPromise = APP.services.user.login(request);
  loginPromise.then(function(user) {
    response.json({ logged : true });
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route POST /signup/
 * @description lets user create a new account with email, password
 */

APP.post('/user/register/', function(request, response) {
  var registerPromise = APP.services.user.register(request, request.body);
  registerPromise.then(function(params) {
    response.json(params.user);
  }, function(error) {
    response.json({ error : error.message });
  })
});

/*!
 * @route POST /user/forgot-password/
 * @description emails a reset link to a user
 */

APP.post('/user/forgot-password/', function(request, response) {
  var passwordReset = APP.services.user.initiatePasswordReset(request);
  passwordReset.then(function() {
    response.json({ success : true });
  }, function(error) {
    response.json({ error : error.message });
  });
});

/*!
 * @route POST /user/reset-password/
 * @description let's a user select a new password
 **/

APP.post('/user/reset-password/', function(request, response, next) {
  var updatePasswordPromise = APP.services.user.updatePassword(request);
  updatePasswordPromise.then(function() {
    response.json({ success : true });
    next();
  }, function(error) {
    response.json({ error : error.message });
  });
});

/**
 * @route POST /user/update/:id/
 * @description Update a user
 **/

APP.post('/user/update/:id/', permissions.checkLogged, function(request, response) {
  // User to Delete ID, and Current Teams ID
  var userId = request.params.id;
  var changes = request.body;
  if (userId && userId.toString() !== 'undefined') {
    var updateUserPromise = APP.services.user.updateUser(request, userId, changes);
    updateUserPromise.then(function() {
      response.json({ success : true });
    }, function(error) {
      response.json({ error : error.message });
    });
  } else {
    response.json({ error : 'Must Provide a user ID!' });
  };
});

/**
 * @route DELETE /user/delete/:id
 * @description delete a user
 **/

APP.del('/user/delete/:id/', permissions.checkLogged, function(request, response) {
  // User to Delete ID, and Current Teams ID
  var userId = request.params.id
    , teamId = request.session.team._id;
  if (userId && userId.toString() !== 'undefined') {
    var removePromise = APP.services.user.deleteUser(request, userId, teamId);
    removePromise.then(function() {
      response.json({ success : true });
    }, function(error) {
      response.json({ error : error.message });
    });
  } else {
    response.json({ error : 'Must Provide a user ID!' });
  };
});

/* EOF */