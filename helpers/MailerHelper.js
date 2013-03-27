
/*!
 * @class helpers
 * @description Mail Related Methods
 */

/*!
 * @list dependencies 
 */
 
var fs = require('fs')
  , ejs = require('ejs')
  , nodemailer = require('nodemailer');

/*! 
 * @description Setup SMTPTransport 
 */
var SMTPTransport = nodemailer.createTransport('Sendmail', {
  args: ['-f noreply@marucci-elite.com']
});

/*!
 * @method loadEJSFiles
 * @description Load both EJS Files
 */

function loadEJSFiles() {
  var promise = new APP.Promise();
  return promise;
};

/*!
 * @class SMTP Mailer
 * @method send
 * @description Uses gmail smtp server (WARNING Gmail has 2000 emails daily limit)
 * @ options = { template: , to: , subject: , variables: }                    
 */

exports.send = function(options) {
  var promise = new APP.Promise();
  // Prepare Email
  var emailTemplatePath = __dirname + '/../views/emails/';
  var layoutSource = fs.readFileSync(emailTemplatePath + 'layout.ejs', 'utf8');
  var viewSource = fs.readFileSync(emailTemplatePath + options.template + '.ejs', 'utf8');
  var mailVariables = APP.helpers.general.mergeObjects(APP.config.email.variables, options.variables);
  mailVariables.body = ejs.render(viewSource, mailVariables);
  var message = ejs.render(layoutSource, mailVariables);
  var mailOptions = {
    from                 : APP.config.email.from, 
    generateTextFromHTML : true,
    html                 : message,
    to                   : options.to,
    subject              : options.subject
  };
  APP.helpers.logger.log('Email Prepared, Sending...');
  // Send Email
  SMTPTransport.sendMail(mailOptions, function(error) {
    if (error) {
      APP.helpers.logger.error(error);
      if (/AuthError/i.test(error)) {
        promise.reject(new Error('Email Server not working, Please try again later!'), true);
      } else {
        console.error(error);
        promise.reject(error, true);
        SMTPTransport.close();
      };
    } else {
      promise.resolve();
      SMTPTransport.close();
    };
  });
  return promise;
};

/* EOF */