
/**
 * @class LoginManager
 * @description Handles everything for Login, Register, Recover & Reset Password
 **/

(function() {

  // main class protoype
  function LoginManager(container) {
    var _self = this;
    this.baseTitle = 'Marucci Elite | ';
    this.container = container;
    this.hasPushstate = !!(window.history && history.pushState);
    this.loginForm = $('#login', container);
    this.loginFormTop = $('#index-login-top', container);
    this.registerForm = $('#register', container);
    this.forgotForm = $('#forgot', container);
    this.resetForm = $('#reset', container);
    this.forgotLink = $('#forgot-link', container);
    this.loginSubmit = $('#login-submit', container);
    this.loginSubmitTop = $('#login-submit-top', container);
    this.forgotSubmit = $('#forgot-submit', container);
    this.resetSubmit = $('#reset-submit', container);
    this.registerSubmit = $('#register-submit', container);
    this.hideAll = _.bind(this.hideAll, this);
    this.setTitle = _.bind(this.setTitle, this);
    this.showForgotForm = _.bind(this.showForgotForm, this);
    this.showResetForm = _.bind(this.showResetForm, this);
    this.showRegisterForm = _.bind(this.showRegisterForm, this);
    this.showLoginForm = _.bind(this.showLoginForm, this);
    this.init = _.bind(this.init, this);
    this.loginSubmit.on('click', function(evt) { _self.login(evt, 'bottom') });
    this.loginSubmitTop.on('click', function(evt) { _self.login(evt, 'top') });
    this.forgotSubmit.on('click', function(evt) { _self.forgot(evt) });
    this.resetSubmit.on('click', function(evt) { _self.reset(evt) });
    this.registerSubmit.on('click', function(evt) { _self.register(evt) }); 
    this.forgotLink.on('click', function(evt) { _self.showForgotForm(evt) });   
    // init
    this.init();
  };

  // __constructor
  LoginManager.prototype.init = function(options) {
    (typeof(console) !== 'undefined') ? console.log('Init LoginManager') : null;
    options = options || {};
    $('#index-facility-dropdown', this.container).change(function(evt) {
      var val = $(this).val();
      return false;
    });
    // determine pathname from route to set an initial action
    switch ($(location).attr('pathname')) {
      case '/user/login/':
        this.action = 'login';
        this.showLoginForm();
        break;
      case '/user/register/':
        this.action = 'register';
        this.showRegisterForm();
        break;
      case '/user/forgot-password/':
        this.action = 'forgot';
        this.showForgotForm();
        break;
      case '/user/reset-password/':
        this.action = 'reset';
        this.showResetForm();
        break;
    }
  };

  // display login form
  LoginManager.prototype.showLoginForm = function() {
    this.action = 'login';
    this.titleVerb = 'Login';
    this.setPath('/user/login/');
    this.hideAll();
    this.loginForm.show();
  };

  // display registration form depending on dropdown selected
  LoginManager.prototype.showRegisterForm = function() {
    this.action = 'register';
    this.titleVerb = 'Register';
    this.setPath('/user/register/');
    this.hideAll();
    this.registerForm.show();
  };

  // display forgotten password email form
  LoginManager.prototype.showForgotForm = function() {
    this.action = 'forgot';
    this.titleVerb = 'Forgot Password';
    this.setPath('/user/forgot-password/');
    this.hideAll();
    this.forgotForm.show();
  };

  // display password update/reset form
  LoginManager.prototype.showResetForm = function() {
    this.action = 'reset';
    this.titleVerb = 'Reset Password';
    this.setPath('/user/reset-password/');
    this.hideAll();
    this.resetForm.show();
  };

  // hide all links/forms first
  LoginManager.prototype.hideAll = function() {
    this.loginForm.hide();
    this.registerForm.hide();
    this.forgotForm.hide();
    this.resetForm.hide();
    this.setTitle();
  };

  // dynamically set the documents title on clicks
  LoginManager.prototype.setTitle = function(verb) {
    verb = verb || this.titleVerb;
    document.title = this.baseTitle + this.titleVerb;
  };

  // if we have pushState, set the path based on a click/path
  LoginManager.prototype.setPath = function(path) {
    if (this.hasPushstate) {
      history.pushState(null, null, path);
    };
  };

  // Display ERROR message with the notifications class
  LoginManager.prototype.displayError = function(message) {
    Notifications.push({
      text: message,
      autoDismiss: 3,
      'class': 'error'
    });
  };

  // Display success message 
  LoginManager.prototype.displayMessage = function(message) {
    Notifications.push({
      text: message,
      autoDismiss: 3,
      time: 'just now'
    });
  };

  // perform login ajax request after successful validation
  LoginManager.prototype.login = function(evt, which) {
    var _self = this, form;
    evt.preventDefault();
    if (which === 'top') {
      form = $('form', _self.loginFormTop);
    } else {
      form = $('form', _self.loginForm);
    };
    form.validate(function() {
      $.post('/user/login/', form.serialize(), function(data) {
        if (data.logged && data.logged === true) {
          _self.displayMessage('Successfully Logged in!');
          setTimeout(function() {
            window.location = '/dashboard/';
          }, 1500);
        } else {
          _self.displayError(data.error);
        };
      });
    });
  };

  // perform forgot password ajax request after validation
  LoginManager.prototype.forgot = function(evt) {
    var _self = this
      , form = $('form', _self.forgotForm);
    evt.preventDefault();
    form.validate(function() {
      $.post('/user/forgot-password/', form.serialize(), function(data) {
        if (data.logged && data.logged === true) {
          _self.displayMessage('Password recovery Email successfully sent!');
        } else {
          _self.displayError(data.error);
        };
      });
    });
  };

  // perform ajax password reset after validation
  LoginManager.prototype.reset = function(evt) {
    var _self = this
      , form = $('form', _self.resetForm);
    evt.preventDefault();
    form.validate(function() {
      $.post('/user/reset-password/', form.serialize(), function(data) {
        if (data.error) {
          _self.displayError(data.error);
        } else {
          _self.displayMessage('Password successfully Reset!');
        };
      });
    });
  };

  // perform ajax registration after validation
  LoginManager.prototype.register = function(evt) {
    var _self = this
      , form = $('form', _self.registerForm);
    evt.preventDefault();
    form.validate(function() {
      $.post('/user/register/', form.serialize(), function(data) {
        if (data.error) {
          _self.displayError(data.error);
        } else {
          _self.displayMessage('User Successfully Registered!');
          setTimeout(function() {
            window.location = '/dashboard/';
          }, 1500);
        };
      });
    }, function() {
      if ($('#user-type').val() === '') {
        return {
          message : 'Please Select a User Type!',
          method  : function() {
            $('#user-type').focus();
          }
        }
      } else {
        return true;
      }
    });
  };

  // instantiate if needed
  (function($) {
    var needed = ($('body.login-manager').length !== 0) ? true : false;
    if (needed) {
      return new LoginManager($('body.login-manager'));
    };
  })(jQuery);

}).call(this);

/* EOF */