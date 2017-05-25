var fs = require('fs');
var cron = require('node-cron');

//var mockIndexFeed = require('./mockdata/mock_index.json');
//var mockHvgFeed = require('./mockdata/mock_hvg.json');
var feedList = require('./mockdata/mock_feedlist.json').items;
//console.log(feedList[1]);

var task = cron.schedule('*/1 * * * * *', function () {
    console.log('in 1 sec');
}, false)
task.start();

//return readFileASync(feedName).then(function (data) {
//    console.log('readFileASync resolves: ' + feedName);
//    cachedFeeds['index'] = data;
//    return data;
//}).catch(function (err) {
//    console.log('readFileSync rejected');
//    console.log(err);
//})