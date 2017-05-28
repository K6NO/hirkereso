'use strict';
var request = require('request')
    , FeedParser = require('feedparser')
    , Iconv = require('iconv').Iconv;

function complexParser(url) {
    return new Promise((resolve, reject) => {
        // Define our streams
        var req = request(url, {timeout: 10000, pool: false});
        req.setMaxListeners(50);
        // Some feeds do not respond without user-agent and accept headers.
        req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
        req.setHeader('accept', 'text/html,application/xhtml+xml');

        var feedparser = new FeedParser();
        var parsedFeedObject = { "items" : [] };


        // Define our handlers
        req.on('error', (err) => {reject(err);});
        req.on('response', function(res) {
            // throw error if response is not 200 except with totalcar (returns feed with 404)
            if (res.statusCode != 200 && url === 'http://totalcar.hu/rss/podcast') return this.emit('error', new Error('Bad status code'));
            var charset = getParams(res.headers['content-type'] || '').charset;
            if (url.indexOf('origo.hu') !== -1 || url.indexOf('storyonline.hu') !== -1) charset = 'iso-8859-2';
            res = maybeTranslate(res, charset);

            res.pipe(feedparser);
        });
        req.on('end', () => { return resolve(parsedFeedObject)});


        feedparser.on('error', (err)=>{console.log('error when parsing: ', url + ' with error: ' + err);});
        feedparser.on('end', done);
        feedparser.on('readable', function() {
            var post;
            while (post = this.read()) {
                let parsedFeed = {};
                parsedFeed.title = post.title;
                parsedFeed.url = post.link;
                parsedFeed.categories = post.categories;
                parsedFeed.pubdate = post.pubDate;
                parsedFeedObject.items.push(parsedFeed);
            }
            return parsedFeedObject;
        });
    })
}

function maybeTranslate (res, charset) {
    var iconv;
    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            console.log('Converting from charset %s to utf-8', charset);
            iconv.on('error', done);
            // If we're using iconv, stream will be the output of iconv
            // otherwise it will remain the output of request
            res = res.pipe(iconv);
        } catch(err) {
            res.emit('error', err);
        }
    }
    return res;
}

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

function done(err) {
    if (err) {
        console.log(err, err.stack);
        return process.exit(1);
    }
}

module.exports.complexParser = complexParser;