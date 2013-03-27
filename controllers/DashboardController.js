
/*!
 * @list dependencies
 */

var permissions = APP.middlewares.permissions;

/*!
 * @routes GET /dashboard/
 */

APP.get('/dashboard/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/** ---- HTML5 Routes - Segment for later Changes, otherwise /dashboard/?/ ---- 

/*!
 * @routes GET /dashboard/team/
 */

APP.get('/dashboard/team/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/profile/
 */

APP.get('/dashboard/account/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/profile/
 */

APP.get('/dashboard/account/responsible-party/', permissions.checkLogged, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/responsible-party', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/team/setup/
 */

APP.get('/dashboard/team/setup/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/team/members/
 */

APP.get('/dashboard/team/members/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/team/invite/
 */

APP.get('/dashboard/team/invite/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/bookings/
 */

APP.get('/dashboard/bookings/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/*!
 * @routes GET /dashboard/bookings/calendar/
 */

APP.get('/dashboard/bookings/calendar/', permissions.checkLogged, permissions.checkResponsibleParty, function(request, response, next) {
  var localsPromise = APP.services.dashboard.setEJSLocals(request.session);
  localsPromise.then(function(locals) {
    response.render('dashboard/index', locals);
  }, function(error) {
    response.redirect('/user/register/');
  });
});

/* EOF */