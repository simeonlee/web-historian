var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(asset, 'utf8', function(err, data) {
    callback(err, data, res);
  });
};

exports.readPage = function(err, data, res) {
  if (err) {
    res.writeHead(404);
    res.end();
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  }
}

exports.storeAssets = function(res, asset, callback) {

}

exports.writePage = function(file, data, callback) {
  fs.appendFile(file, data, function(err) {
    callback();
  });
}


// As you progress, keep thinking about what helper functions you can put here!
