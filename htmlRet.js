

var retrieveBody = function(link) {
  var request = require("request");
  request(link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return body;
    }
  })
  return null;
}

module.exports = retrieveBody;
