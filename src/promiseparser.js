// Index http://index.hu/24ora/rss/
// Origo http://www.origo.hu/contentpartner/rss/hircentrum/origo.xml
'use strict';
const feedparser = require('feedparser-promised');

//const url = 'http://index.hu/24ora/rss/';

function parseFeed(url) {
    return new Promise (function(resolve, reject){
        feedparser.parse(url)
            .then( (items) => {
                let parsedFeedsObject = { "items" : [] };
                items.forEach((item) => {
                    let parsedFeed = {};
                    parsedFeed.title = item.title;
                    parsedFeed.link = item.link;
                    parsedFeed.categories = item.categories;
                    //parsedFeed.publisher = item.meta.title;
                    parsedFeed.pubDate = item.pubDate;
                    parsedFeedsObject.items.push(parsedFeed);
                })
                return parsedFeedsObject;
            })
            .then((parsedFeedsObject) => {
                //console.log(parsedFeedsObject);
                //console.log('_____________')
                resolve(parsedFeedsObject);
            })
            .catch( (error) => {
                console.log('error: ', error);
                reject(error);
            });
    })

}

module.exports.parseFeed = parseFeed;
//let nyuff = parseFeed(url);
//
//console.log(nyuff);

/*
* feedparser.parse(url)
 .then( (items) => {
 let parsedFeedsObject = { "items" : [] };
 items.forEach((item) => {
 let parsedFeed = {};
 parsedFeed.title = item.title;
 parsedFeed.link = item.link;
 parsedFeed.categories = item.categories;
 //parsedFeed.publisher = item.meta.title;
 parsedFeed.pubDate = item.pubDate;
 parsedFeedsObject.items.push(parsedFeed);
 console.log(`title: ${item.title}`);
 })
 return parsedFeedsObject;
 })
 .then((parsedFeedsObject) => {
 console.log(parsedFeedsObject);
 console.log('_____________');
 })
 .catch( (error) => {
 console.log('error: ', error);
 });
* */
