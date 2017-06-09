'use strict';
var express = require('express');
var fs = require('fs');
var cron = require('node-cron');

const parserModule = require('./parser.js');
var feedPublishersList = require('../feedlist.json');

// CACHED DATA
var cachedFeeds = { };


/**
 * Returns feedPublishersListCache in a 3 col structure. Used to create AMP-lists on UI
 * @param categpry
 * @returns {feedPublishersListCache}
 */
function getFeedList(category){
    var feedPublishersListCache = {
        col1 : {},
        col2 : {},
        col3 : {}
    };

    // request for main page
    if(category === undefined){
        // divide feeds into three columns with %3

        feedPublishersList.items.map(function (publisher, index) {
            var publisherName = publisher.title.toLowerCase();
            if(index%3 === 0){
                feedPublishersListCache.col1[publisherName] = publisher;
            } else if (index%3 === 1){
                feedPublishersListCache.col2[publisherName] = publisher;
            } else if (index%3 === 2){
                feedPublishersListCache.col3[publisherName] = publisher;
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

        filteredList.map(function (publisher, index) {
            var publisherName = publisher.title.toLowerCase();
            if(index%3 === 0){
                feedPublishersListCache.col1[publisherName] = publisher;
            } else if (index%3 === 1){
                feedPublishersListCache.col2[publisherName] = publisher;
            } else if (index%3 === 2){
                feedPublishersListCache.col3[publisherName] = publisher;
            }
        });
    }
    return feedPublishersListCache;
}

/**
 * CRON task refreshes cached feeds every 5 mins
 */
function startPeriodicRefreshOfFeeds() {
    var task = cron.schedule('*/300 * * * * *', function () {
        feedPublishersList.items.forEach(function (publisher) {
            getFreshParsedFeed(publisher.rss).then(function (freshFeeds) {

                cachedFeeds[publisher.title.toLowerCase()] = freshFeeds;
            });
        });
    });
    task.start();
}
startPeriodicRefreshOfFeeds();


/** returns cached feeds
 * @param feedName
 * @returns {*}
 */
function getCachedFeed(feedName){
    return cachedFeeds[feedName];
}

//
/**
 * Refreshes cached feed by calling the parser
 * @param url
 * @returns {Promise.<shortListedFeedsObject>} - first 12 results
 */
function getFreshParsedFeed(url){
    return parserModule.complexParser(url)
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
module.exports.getFreshParsedFeed = getFreshParsedFeed;
module.exports.getFeedList = getFeedList;
module.exports.startPeriodicRefreshOfFeeds = startPeriodicRefreshOfFeeds;