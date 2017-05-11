'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

var feedList = require('../mockdata/feedlist.json').items;
var mockIndexFeed = require('../mockdata/mock_index.json');
var mockHvgFeed = require('../mockdata/mock_hvg.json');

var mockFeeds = {
    index : mockIndexFeed,
    hvg : mockHvgFeed,
    origo : mockIndexFeed,
    444 : mockHvgFeed
};

function getCachedFeed(feedName){
    return mockFeeds[feedName];
}

function getFreshFeed(feedName){
    fs.readFile('../mockdata/mock_' + feedName + '.json', function(data, err){
        if(!err){
            mockFeeds[feedName] = data;
        } else {
            throw new Error('Error when reading fresh feed from ' + feedName);
        }
    })
}

module.exports.getCachedFeed = getCachedFeed;
module.exports.getFreshFeed = getFreshFeed;