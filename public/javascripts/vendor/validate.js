
/**
 * @plugin .validate()
 * @description Form Validation made specifically for bootstrap/plastique notifications
 **/

(function($) {
  
  $.extend($.fn, {
  
    // .validate() plugin
    validate: function(callback, customValidationFN) {
      // maintain context
      var _self = this;
      // check if this is a valid form
      if (!_self.length || !_self.parent().find('form').length) {
        if (window.console) {
          console.warn('Invalid DOM Element!');
        };
        return;
      };
      // success callback
      this.callback = callback;
      // custom validation fn?
      this.customValidationFN = customValidationFN || null;
      // defaults
      this.settings = {
        errors : [],
        button : $('button', this)
      };
      // method for checking email
      this.isEmail = function(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
      };
      // validate inputs
      $('input:visible', this).each(function(index, elem) {
        var val = $(elem).val()
          , len = $(elem).val().length
          , min = $(elem).attr('minlength');
        var fieldName = $(elem).attr('name').toLowerCase().replace(/(_|\-)/m, ' ').replace(/\b[a-z]/g, function(first) {
          return first.toUpperCase();
        });
        if (len < min) {
          var message = fieldName + ' needs to be at least ' + min + ' characters long!';
          _self.settings.errors.push(message);
        };
        if ($(elem).hasClass('email') && !_self.isEmail(val)) {
          _self.settings.errors.push('Invalid Email Address!');
        };
        if ($(elem).hasClass('required') && val.length === 0) {
          _self.settings.errors.push(fieldName + ' is Required!');
        };
      });
      // custom validation
      if (_self.customValidationFN !== null) {
        var validationResults = _self.customValidationFN.apply();
        if (validationResults !== true) {
          _self.settings.errors.push(validationResults.message);
          validationResults.method.apply();
        };
      };
      // check for errors
      if (_self.settings.errors.length > 0) {
        // find notifications container
        var wrapper = _self.closest('.login-wrapper');
        // Max out at displaying 3 errors most. Anything more than 3 is sliced
        if (_self.settings.errors.length > 3) {
          _self.settings.errors = _self.settings.errors.slice(0, 3);
        };
        // Iterate over errors and notify the user
        _.map(_self.settings.errors, function(message) {
          wrapper.addClass('wobble');
          Notifications.push({
            text: message,
            autoDismiss: 5,
            'class': 'error'
          });
          wrapper.on('webkitAnimationEnd animationEnd mozAnimationEnd', function() {
            wrapper.off('webkitAnimationEnd');
            wrapper.removeClass('wobble');
          });
        });
        // reset errors
        _self.settings.errors = [];
      } else {
        // valid
        _self.callback.apply();
      };

    }
  
  });

})(jQuery);

/* EOF */