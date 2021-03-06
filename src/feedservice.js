'use strict';
var express = require('express');
var fs = require('fs');
var cron = require('node-cron');

const parserModule = require('./parser.js');
var feedPublishersList = require('../feedlist.json');

// CACHED DATA
var cachedFeeds = { };

// helper methods
/**
 * After server restart cachedFeeds is empty and feeds undefined -
 * @param feeds
 * @returns {*}
 */
var checkIfFeedsUndefined = function (feeds) {
    if (feeds === undefined) {
        console.log('feeds undefined');
        feeds = [];
    }
    return feeds;
};

/** returns cached feeds
 * @param feedName
 * @returns {*}
 */
function getCachedFeed(feedName){
    return cachedFeeds[feedName];
}


/**
 * Returns feedPublishersListCache in a 3 col structure. Used to create AMP-lists on UI
 * @param categpry
 * @returns {feedPublishersListCache}
 */
function getPublisherList(category){
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

                // get latest feeds for given publisher from cache
                let feeds = getCachedFeed(publisherName);
                feeds = checkIfFeedsUndefined(feeds);

                // add publisher info
                feedPublishersListCache.col1[publisherName] = publisher;

                // add feeds from the publisher
                feedPublishersListCache.col1[publisherName]['feeds'] = feeds;
            } else if (index%3 === 1){
                let feeds = getCachedFeed(publisherName);
                feeds = checkIfFeedsUndefined(feeds);

                feedPublishersListCache.col2[publisherName] = publisher;
                feedPublishersListCache.col2[publisherName]['feeds'] = feeds;

            } else if (index%3 === 2){
                let feeds = getCachedFeed(publisherName);
                feeds = checkIfFeedsUndefined(feeds);

                feedPublishersListCache.col3[publisherName] = publisher;
                feedPublishersListCache.col3[publisherName]['feeds'] = feeds;
            }
        });
    } else {
        // request for category page -> filter publishers by category
        let filteredList = feedPublishersList.items.filter(function (publisher) {
            if(publisher.category.indexOf(category) !== -1){
                return publisher
            }
        });

        // divide feeds into three columns with %3
        filteredList.map(function (publisher, index) {
            var publisherName = publisher.title.toLowerCase();
            if(index%3 === 0){
                let feeds = getCachedFeed(publisherName);
                feeds = checkIfFeedsUndefined(feeds);

                feedPublishersListCache.col1[publisherName] = publisher;
                feedPublishersListCache.col1[publisherName]['feeds'] = feeds;
            } else if (index%3 === 1){
                let feeds = getCachedFeed(publisherName);
                feeds = checkIfFeedsUndefined(feeds);

                feedPublishersListCache.col2[publisherName] = publisher;
                feedPublishersListCache.col2[publisherName]['feeds'] = feeds;
            } else if (index%3 === 2){
                let feeds = getCachedFeed(publisherName);
                feeds = checkIfFeedsUndefined(feeds);

                feedPublishersListCache.col3[publisherName] = publisher;
                feedPublishersListCache.col3[publisherName]['feeds'] = feeds;
            }
        });
    }
    return feedPublishersListCache;
}

// Periodic refresh of cachedFeeds

/**
 * CRON task refreshes cached feeds every 5 mins
 */
function startPeriodicRefreshOfFeeds() {
    var task = cron.schedule('*/300 * * * * *', function () {
        feedPublishersList.items.forEach(function (publisher) {
            getFreshParsedFeed(publisher.rss).then(function (freshFeeds) {
                cachedFeeds[publisher.title.toLowerCase()] = freshFeeds;
                console.log('cache updated ' + publisher.title);
            });
        });
    });
    task.start();
}

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
module.exports.getPublisherList = getPublisherList;
module.exports.startPeriodicRefreshOfFeeds = startPeriodicRefreshOfFeeds;