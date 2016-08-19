var htmlFetcher = require('./htmlfetcher');
var fs = require('fs');

fs.appendFile('/Users/student/desktop/2016-07-web-historian/archives/cronChecker.txt', 'cron checker runs: ' + new Date() + '\n');

htmlFetcher.htmlFetcher();