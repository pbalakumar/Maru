
/*!
 * @config NODE_ENV
 */

module.exports = function(options) {

  /*!
   * @description NODE_ENV=development configuration
   */

  var development = {
    port: 8000,
    baseUrl: 'http://localhost:8000/',
    mongoDB: 'mongodb://localhost/marucci',
    email: {
      provider: 'sendmail',
      from: 'Marucci Elite <no-reply@bodhi5.com>',
      variables: {
        title: 'Marucci Elite',
        base_url: 'http://localhost:8000',
        prefs_url: 'http://localhost:8000/account',
        company: 'Marucci Elite'
      }
    },
    authorizedotnet: {
      username : process.env.MAR_AUTH_NET_EMAIL,
      password : process.env.MAR_AUTH_NET_PASSWORD,
      key      : process.env.MAR_AUTH_NET_KEY
    }
  };

  /*!
   * @description NODE_ENV=production configuration
   */

  var production = {
    port: 8000,
    baseUrl: 'http://my-xen.com:8000/',
    mongoDB: 'mongodb://localhost/marucci',
    email: {
      provider: 'sendmail',
      from: 'Marucci Elite <no-reply@bodhi5.com>',
      variables: {
        title: 'Marucci Elite',
        base_url: 'http://my-xen.com:8000',
        prefs_url: 'http://my-xen.com/account:8000',
        company: 'Marucci Elite'
      }
    },
    authorizedotnet: {
      username : process.env.MAR_AUTH_NET_EMAIL,
      password : process.env.MAR_AUTH_NET_PASSWORD,
      key      : process.env.MAR_AUTH_NET_KEY
    }
  };

  /*!
   * @description Determine NODE_ENV to select configuration environment
   */

  // development
  if (process.env.NODE_ENV === 'development') {
    return development;
  // production
  } else if (process.env.NODE_ENV === 'production') {
    return production;
  // default to production
  } else {
    return production;
  };
     
};

/* EOF */