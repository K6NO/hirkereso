'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var cron = require('node-cron');

var mockIndexFeed = require('../mockdata/mock_index.json');
var mockHvgFeed = require('../mockdata/mock_hvg.json');

var cachedFeeds = {
    index : mockIndexFeed,
    hvg : mockHvgFeed,
    origo : mockIndexFeed,
    444 : mockHvgFeed
};


// Refreshes the list of feeds - used to display boxes on UI
//
function getFeedList(category){
    var feedList = require('../mockdata/feedlist.json').items;
    var feedListCache = {};

    //TODO separate cron task
    var task = cron.schedule('*/5 * * * * *', function () {
        let feed = getFreshFeed('index');
        console.log(feed);
        console.log('in 5 sec');
    })

    if(category === undefined){
        feedList.map(function (feed) {
            var key = feed.title.toLowerCase();
            feedListCache[key] = feed;
        });
    } else {
        feedList.map(function (feed) {
            console.log('yaaaay')
            var key = feed.title.toLowerCase();
            var feedCategory = feed.category;
            if (feedCategory.indexOf(category) !== -1){
                feedListCache[key] = feed;
            }
        });
    }
    return feedListCache;
}



// make a promise version of readFile
// readFile should return data parsed as JSON -> resolve(JSON.parse(data))
function readFileASync(feedName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/../mockdata/mock_' + feedName + '.json', 'utf8', function(err, data){
            if (err) {
                console.log('in reject');
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
    return readFileASync(feedName).then(function (data) {
        console.log('readFileASync resolves: ' + feedName);
        cachedFeeds['index'] = data;
        return data;
    }).catch(function (err) {
        console.log('readFileSync rejected');
        console.log(err);
    })
}

function getFreshFeedPromise(feedName){
    console.log('in getFreshFeedPromise');
    return readFileASync(feedName);
}

module.exports.getCachedFeed = getCachedFeed;
module.exports.getFreshFeed = getFreshFeed;
module.exports.getFreshFeedPromise = getFreshFeedPromise;
module.exports.getFeedList = getFeedList;