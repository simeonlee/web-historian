// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var request = require('request'); // install request


var x = archive.readListOfUrls(function(urls) {
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    archive.isUrlArchived(url, function(bool) {
      if (!bool) {
        request(url, function(err, response, body) {
          console.log();
        });
      }
    });
  }
});

exports.x = x;