var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    var path;
    if (req.url === '/') {
      path = __dirname + '/public/index.html';
    } else {
      path = archive.paths.archivedSites + req.url;
    }
    utils.serveAssets(res, path, utils.readPage);
  },
  'POST': function(req, res) {
    // var path = archive.paths.archivedSites + req.url;
    res.writeHead(302, {'Content-Type': 'text/html'});
    console.log('THIS IS POST FUNCTION - DATA COMING NEXT');
    utils.collectData(req, function(data) {
      var path = data.slice(data.indexOf('=') + 1);
      path = path + '\n';
      // console.log(path);
      // var sitesDirectory = archive.paths.archivedSites;
      var sitesList = archive.paths.list;
      utils.writePage(sitesList, path, function(err) {
        if (err) {
          console.log(err);
        }
        utils.serveAssets(res, sitesList, function(err, data) {
          // console.log(data);
          res.end();
        });
      });
    });
  },
  'OPTIONS': function(req, res) {
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  }
};
