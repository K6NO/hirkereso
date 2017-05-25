'use strict';
const cron = require('node-cron');
const feedService = require('./feedservice.js');
const FeedParser = require('feedparser');

const request = require('request'); // for fetching the feed

// Index http://index.hu/24ora/rss/
// Origo http://www.origo.hu/contentpartner/rss/hircentrum/origo.rss
const options = {
    resume_saxerror: false
};
var req = request('http://www.origo.hu/contentpartner/rss/hircentrum/origo.rss');
var feedparser = new FeedParser(options);


req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
req.setHeader('accept', 'text/html,application/xhtml+xml');

req.on('error', function (error) {
console.log('Error when fetching new feed from ' + req + '. ' + error)});

req.on('response', function (res) {
    var charset;
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
    }
    charset = getParams(res.headers['content-type'] || '');
    console.log(charset);
    stream.pipe(feedparser);

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


function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) { return part.trim(); });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}
