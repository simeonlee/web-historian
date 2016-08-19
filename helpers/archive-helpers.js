var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var input = fs.createReadStream(archive.paths.list);
  var urls = [];

  input.on('data', function(data) {
    urls = data.toString().split('\n');
  });

  input.on('end', function(data) {
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(urls.indexOf(url) > -1);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(archive.paths.list, url + '\n', callback);
};

exports.isUrlArchived = function(file) {
  return new Promise(function(resolve, reject) {
    fs.readdir(archive.paths.archivedSites, function(err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files.indexOf(file) > -1);
      }
    });
  });
};

exports.downloadUrls = function(urlArray) {
  for (var i = 0; i < urlArray.length; i++) {
    (function(i) {
      var url = urlArray[i];
      archive.isUrlArchived(url)
        .then(function(archived) {
          if (archived) {
            console.log(url);
            //throw new Error('This url is not archived in our database');
          } else {
            request('http://' + url, function(err, response, body) {
              fs.writeFile(exports.paths.archivedSites + '/' + url, body, function(err) {
                if (err) {
                  throw err;
                }
                console.log(url + ' downloaded to archive');
              });
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    })(i);
  }
};
