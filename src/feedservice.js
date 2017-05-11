'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

var feedList = require('../mockdata/feedlist.json').items;
var mockIndexFeed = require('../mockdata/mock_index.json');
var mockHvgFeed = require('../mockdata/mock_hvg.json');



var cachedFeeds = {
    index : mockIndexFeed,
    hvg : mockHvgFeed,
    origo : mockIndexFeed,
    444 : mockHvgFeed
};


// Refreshes the list of feed - used to display boxes on UI
function refreshFeedList(){
    var feedListCache = {};
    feedList.map(function (feed) {
        var key = feed.title.toLowerCase();
        console.log(key);
        feedListCache[key] = feed;
    });
    return (feedListCache);
}


// make a promise version of readFile
function readFileASync(feedName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(__dirname + '/../mockdata/mock_' + feedName + '.json', 'utf8', function(err, data){
            if (err) {
                console.log('in reject');
                reject(err);
            }
            else {
                console.log('readfile completed');
                resolve(data);
            }
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
        console.log('readFileSync resolves');
        cachedFeeds[feedName] = data;
        console.log(data);
        console.log('mockFeeds[' + feedName + ']');
        console.log(cachedFeeds[feedName]);
    }).catch(function (err) {
        console.log('readFileSync rejected')
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
module.exports.refreshFeedList = refreshFeedList;