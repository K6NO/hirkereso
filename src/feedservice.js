'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var cron = require('node-cron');

const newParserModule = require('./newparser.js');

var feedPublishersList = require('../mockdata/mock_feedlist.json');

/*
* CACHED DATA
*
*/
var cachedFeeds = {

};

// CRON module refreshes cached feeds every 5 mins
function startPeriodicRefreshOfFeeds() {
    var task = cron.schedule('*/150 * * * * *', function () {
        feedPublishersList.items.forEach(function (publisher) {
            getFreshParsedFeed(publisher.rss).then(function (freshFeeds) {

                cachedFeeds[publisher.title.toLowerCase()] = freshFeeds;
            });
        });
    });
    task.start();
}
startPeriodicRefreshOfFeeds();


// Returns feedPublishersListCache in a 3 col structure. Used to AMP-lists on UI
function getFeedList(category){
    var feedPublishersListCache = {
        col1 : {},
        col2 : {},
        col3 : {}
    };

    // request for main page
    if(category === undefined){
        // divide feeds into three columns with %3
        let third = Math.floor(feedPublishersList.items.length/3);
        if (third === 1) {third = 3};
        feedPublishersList.items.map(function (publisher, index) {
            var publisherName = publisher.title.toLowerCase();
            if(index === 0){
                feedPublishersListCache.col1[publisherName] = publisher;
            } else if (index%3 === 1){
                feedPublishersListCache.col2[publisherName] = publisher;
            } else if (index%3 === 2){
                feedPublishersListCache.col3[publisherName] = publisher;
            } else {
                feedPublishersListCache.col1[publisherName] = publisher;
            }
        });
    } else {
        // request for category page
        // filter publishers by category
        let filteredList = feedPublishersList.items.filter(function (publisher) {
            if(publisher.category.indexOf(category) !== -1){
                return publisher
            }
        });
        // divide feeds into three columns with %3 - correct low divider for better display
        let third = Math.floor(filteredList.length/3);
        if (third === 1) {third = 3};
        filteredList.map(function (publisher, index) {
            var publisherName = publisher.title.toLowerCase();
            if(index === 0){
                feedPublishersListCache.col1[publisherName] = publisher;
            } else if (index%3 === 1){
                feedPublishersListCache.col2[publisherName] = publisher;
            } else if (index%3 === 2){
                feedPublishersListCache.col3[publisherName] = publisher;
            } else {
                feedPublishersListCache.col1[publisherName] = publisher;
            }
        });
    }
    return feedPublishersListCache;
}

// make a promise version of readFile
// readFile should return data parsed as JSON -> resolve(JSON.parse(data))
function readFileASync(feedName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/../mockdata/mock_' + feedName + '.json', 'utf8', function(err, data){
            if (err) {
                console.log('Readfile rejected with parameter: ' + feedName);
                reject(err);
            }
            console.log('readfile completed: ' + feedName);
            resolve(JSON.parse(data));
        });
    });
}

// returns cached feeds
function getCachedFeed(feedName){
    return cachedFeeds[feedName];
}

// refreshes cached feed from mock data source
function getFreshFeed(feedName){
    return readFileASync('uj'+feedName).then(function (data) {
        console.log('readFileASync resolves: ' + feedName);
        cachedFeeds[feedName] = data;
        return data;
    }).catch(function (err) {
        console.log('readFileSync rejected');
        console.log(err);
        return err;
    })
}

// refreshes cached feed by calling the parser
function getFreshParsedFeed(url){
    return newParserModule.complexParser(url)
        .then((parsedFeedsObject)=> {
            let shortListedFeedsObject = {"items" : [] };
            shortListedFeedsObject.items = parsedFeedsObject.items.splice(0,12);
            return shortListedFeedsObject;
        })
        .catch((err)=>{
            return err;
        });
}

module.exports.getCachedFeed = getCachedFeed;
module.exports.getFreshFeed = getFreshFeed;
module.exports.getFreshParsedFeed = getFreshParsedFeed;
module.exports.getFeedList = getFeedList;
module.exports.startPeriodicRefreshOfFeeds = startPeriodicRefreshOfFeeds;