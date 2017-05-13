'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var cron = require('node-cron');

var mockIndexFeed = require('../mockdata/mock_index.json');
var mockHvgFeed = require('../mockdata/mock_hvg.json');
var mockOrigoFeed  =require('../mockdata/mock_origo.json');
var mock444Feed  =require('../mockdata/mock_444.json');


var feedList = require('../mockdata/mock_feedlist.json').items;


var cachedFeeds = {
    index : mockIndexFeed,
    hvg : mockHvgFeed,
    origo : mockOrigoFeed,
    444 : mock444Feed,
    sztarklikk : mockIndexFeed,
    atv : mockHvgFeed,
    vs : mockOrigoFeed,
};


// Refreshes the list of feeds - used to display boxes on UI
// Checks if feed belongs to a category
function getFeedList(category){
    var feedListCache = {};
    console.log('cat: ' + category);
        if(category === undefined){
            console.log('getFeedlist, category undefined' );
            feedList.map(function (feed) {
                var key = feed.title.toLowerCase();
                feedListCache[key] = feed;
            });
        } else {
            feedList.map(function (feed) {
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