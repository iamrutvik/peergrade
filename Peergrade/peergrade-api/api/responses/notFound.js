/**
 * api/responses/badRequest.js
 *
 * This will be available in controllers as res.badRequest('foo', error);
 */

module.exports = function(error, message = "Resource not found") {

  var req = this.req;
  var res = this.res;

  var viewFilePath = 'mySpecialView';
  var statusCode = 404;

  var result = {
    status: false,
    data: null,
  };

  // Optional message
  if (message) {
    result.message = message;
  }

  if(error) {
    result.error = error;
  }else{
    result.error = null;
  }

  // If the user-agent wants a JSON response, send json
  if (req.wantsJSON) {
    return res.status(statusCode).json(result);
  }

  // Set status code and view locals
  res.status(statusCode);
  for (var key in result) {
    res.locals[key] = result[key];
  }
  // And render view
  res.render(viewFilePath, result, function(err) {
    // If the view doesn't exist, or an error occured, send json
    if (err) {
      return res.status(statusCode).json(result);
    }

    // Otherwise, serve the `views/mySpecialView.*` page
    res.render(viewFilePath);
  });
}
