
/*!
 * @route /js/app.js
 * @description Development Mode .js file serving on the fly, not for production.
 */

APP.get('/js/app.js', function(request, response) {
  var jsAssetPromise = APP.services.asset.js();
  jsAssetPromise.then(function(js) {
    // send js with proper headers
    response.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    response.end(js);
  }, function(error) {
    response.json(error);
  });
});

/* EOF */