var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var Promise = require('bluebird');
// Promise.promisifyAll(archive);
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
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
          archive.isUrlArchived(url)
            .then(function(archived) {
              if (!archived) {
                // redirect to loading.html
                utils.serveAssets(res, path.join(__dirname, './public/loading.html'), function(err, data, res) {
                  utils.readPage(err, data, res);
                });
              } else {
                // use fs to serve up the page
                utils.serveAssets(res, archive.paths.archivedSites + '/' + url, function(err, data, res) {
                  utils.readPage(err, data, res);
                });
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else { // does not exist
          archive.addUrlToList(url, function(err) {
            console.log('Added url to list! Our worker will archive the file soon!');
            if (err) {
              res.write('there was an error');
            }

            // return utils.readPage(null, __dirname + '/public/index.html', res);
            utils.serveAssets(res, path.join(__dirname, './public/loading.html'), function(err, data, res) {
              utils.readPage(err, data, res);
            });
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
