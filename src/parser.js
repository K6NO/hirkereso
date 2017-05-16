'use strict';
const cron = require('node-cron');
const feedService = require('./feedservice.js');
const FeedParser = require('feedparser');

const request = require('request'); // for fetching the feed

// Index http://index.hu/24ora/rss/
// Origo http://www.origo.hu/contentpartner/rss/hircentrum/origo.rss
const options = {
    resume_saxerror: false
}
const req = request('http://www.origo.hu/contentpartner/rss/hircentrum/origo.rss');
var feedparser = new FeedParser(options);


req.on('error', function (error) {
console.log('Error when fetching new feed from ' + req + '. ' + error)});

req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
    }
    else {
        console.log('before pipe');
        stream.pipe(feedparser);
    }
});

feedparser.on('error', function (error) {
    console.log('Error when parsing feed with feedparser: ' + error);
});

feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var data = stream.read();
    let exportFeed = {};
    if(data != null) {
        exportFeed.title = data.title;
        exportFeed.link = data.link;
        exportFeed.categories = data.categories;
        exportFeed.publisher = data.meta.title;
        exportFeed.pubDate = data.pubDate;
        console.log(exportFeed);
        console.log('**********');
    }
});


// C . R . O . N
//var task = cron.schedule('*/5 * * * * *', function () {
//    let feed = feedService.getFreshFeed('index');
//    console.log(feed);
//    console.log('in 5 sec');
//});
//task.start();
