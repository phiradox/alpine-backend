

function ls(directory, filter, callback2) {
  var files = [];
  var fs = require("fs");
  fs.readdir(directory, function callback(err, data) {
    if (err !== true) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].split(".")[1] === filter) {
          files.push(data[i]);
        }
      }
      callback2(false, files);
    }
  });
}

module.exports = ls;
