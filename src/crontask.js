'use strict';
const cron = require('node-cron');
const feedService = require('./feedservice.js');
const feedList = require('../mockdata/mock_feedlist.json');


// CRON module refreshes cached feeds every 5 mins
function startPeriodicRefreshOfFeeds() {
    var task = cron.schedule('*/300 * * * * *', function () {
        feedList.items.forEach(function (publisher) {
            feedService.getFreshParsedFeed(publisher.rss).then(function (freshFeeds) {
                console.log(freshFeeds);
            });
        });
    });
    task.start();
}

module.exports.startPeriodicRefreshOfFeeds = startPeriodicRefreshOfFeeds;
