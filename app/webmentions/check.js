const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const parseFeed = require(appRootDirectory + '/app/webmentions/parseFeed');
const axios = require('axios');

exports.check = function check() {
    const github = config.github;
    const webmention = config.webmention;
    const urlDestination = `${github.postUrl}/${webmention.lastSentPath}`;
    const options = {
        headers : {
            Authorization : `token ${github.key}`,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        }
    };

    logger.info(urlDestination);
    // GET the most recent sent date and the feed of webmentions
    axios.all([
        axios.get(urlDestination, options),
        axios.get(webmention.feed)
    ])
        .then(axios.spread((lastDate, feedItems) => {
            // logger.info(lastDate.data.sha);
            // logger.info(lastDate.data.content); // base64 decode this.
            // logger.info(base64.decode(lastDate.data.content));
            // logger.info(feedItems.data);

            // Pass this to the parseFeed function
            parseFeed.check(lastDate, feedItems);
        }));
};
