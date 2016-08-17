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
    var path = archive.paths.archivedSites + req.url;
    console.log(req.headers);
//    utils.storeAssets(res)
  },
  'OPTIONS': function(req, res) {
  }
}

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  }
};
