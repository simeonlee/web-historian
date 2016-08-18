var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    console.log(req.url);
    var path;
    if (req.url === '/') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      path = __dirname + '/public/index.html';
      utils.serveAssets(res, path, utils.readPage);
    } else if (req.url === '/styles.css') {
    // } else {
      res.writeHead(200, {'Content-Type': 'text/css'});
      var cssPath = __dirname + '/public/styles.css';
      utils.serveAssets(res, cssPath, utils.readPage);
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      path = archive.paths.archivedSites + req.url;
      utils.serveAssets(res, path, utils.readPage);
    }
  },
  'POST': function(req, res) {
    // get the url from the post request
    res.writeHead(302, {'Content-Type': 'text/html'});
    req.on('data', function(data) {
      data = data.toString();
      var url = data.slice(data.indexOf('=') + 1);
      // if the url is found in the url list (use isURLInList),
      archive.isUrlInList(url, function(exists) {
        if (exists) {
        // see if file is archived (isUrlArchived)...
          archive.isUrlArchived(url, function(archived) {
            if (archived) {
              // use fs to serve up the page
              utils.serveAssets(res, archive.paths.archivedSites + '/' + url, function(err, data, res) {
                utils.readPage(err, data, res);
              });
            } else {
              // redirect to loading.html
              utils.serveAssets(res, path.join(__dirname, './public/loading.html'), function(err, data, res) {
                utils.readPage(err, data, res);
              });
            }
          });
        } else { // does not exist
          archive.addUrlToList(url, function() {
            console.log('Added url to list! Our worker will archive the file soon!');
            utils.readPage(err, '', res);
          });
        }
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
