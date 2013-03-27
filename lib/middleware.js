

/**
* @middleware checkLogged
* @description Checks if User is logged in
**/

exports.checkLogged = function(request, response) {
  if (request.session && request.session.auth && request.session.auth.logged === true) {
    next();
  } else {
    response.json({ error : 'Not Logged In' });
  };
};

/**
* @middleware checkSuperuser
* @description Checks if an administrator
**/

exports.admin = function(request, response) {
  if (request.session.auth.is_admin === true) {
    next();
  } else {
    response.json({ error : 'Not an Administrator' });
  };
};

/* EOF */