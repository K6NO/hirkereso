'use strict';
const feedparser = require('feedparser-promised');

function parseFeed(url) {
    return new Promise (function(resolve, reject){

        feedparser.parse(url)
            .then( (items) => {
                let parsedFeedsObject = { "items" : [] };
                items.forEach((item) => {
                    let parsedFeed = {};
                    parsedFeed.title = item.title;
                    parsedFeed.url = item.link;
                    parsedFeed.categories = item.categories;
                    parsedFeed.pubdate = item.pubDate;
                    parsedFeedsObject.items.push(parsedFeed);
                });
                return parsedFeedsObject;
            })
            .then((parsedFeedsObject) => {
                resolve(parsedFeedsObject);
            })
            .catch( (error) => {
                console.log('error when parsing: ', url + ' with error: ' + error);
                reject(error);
            });
    })
}

module.exports.parseFeed = parseFeed;
