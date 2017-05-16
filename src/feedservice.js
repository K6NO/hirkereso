'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var cron = require('node-cron');

var mockIndexFeed = require('../mockdata/mock_index.json');
var mockHvgFeed = require('../mockdata/mock_hvg.json');
var mockOrigoFeed  =require('../mockdata/mock_origo.json');
var mock444Feed  =require('../mockdata/mock_444.json');


var feedPublishersList = require('../mockdata/mock_feedlist.json').items;

var cachedFeeds = {
    index : mockIndexFeed,
    hvg : mockHvgFeed,
    origo : mockOrigoFeed,
    444 : mock444Feed,
    sztarklikk : mockIndexFeed,
    atv : mockHvgFeed,
    vs : mockOrigoFeed,
    ps : mockIndexFeed,
    gs : mockOrigoFeed,
    as : mockHvgFeed
};


// Refreshes the list of feeds. Returns feedPublishersListCache. Used to display boxes on UI
function getFeedList(category){
    var feedPublishersListCache = {
        col1 : {},
        col2 : {},
        col3 : {}
    };

    // request for main page
    if(category === undefined){
        // divide feeds into three columns with %3
        let third = Math.floor(feedPublishersList.length/3);
        if (third === 1) {third = 3};
        feedPublishersList.map(function (publisher, index) {
            var publisherName = publisher.title.toLowerCase();
            if(index === 0){
                feedPublishersListCache.col1[publisherName] = publisher;
            } else if (index%third === 1){
                feedPublishersListCache.col2[publisherName] = publisher;
            } else if (index%third === 2){
                feedPublishersListCache.col3[publisherName] = publisher;
            } else {
                feedPublishersListCache.col1[publisherName] = publisher;
            }
        });
    } else {
        // request for category page
        // filter publishers by category
        let filteredList = feedPublishersList.filter(function (publisher) {
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
            } else if (index%third === 1){
                feedPublishersListCache.col2[publisherName] = publisher;
            } else if (index%third === 2){
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

// refreshes cached feed
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
//
//function getFreshFeedPromise(feedName){
//    console.log('in getFreshFeedPromise');
//    return readFileASync(feedName);
//}

module.exports.getCachedFeed = getCachedFeed;
module.exports.getFreshFeed = getFreshFeed;
//module.exports.getFreshFeedPromise = getFreshFeedPromise;
module.exports.getFeedList = getFeedList;