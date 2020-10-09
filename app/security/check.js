/*
Perform a GET:
- On the last sent date file in the GithubAPI
- To get the feed of webmention items

Then pass those items to the Parse Feed funcntion
*/

const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const parseFeed = require(appRootDirectory + '/app/webmentions/send/parseFeed');
const slack = require(appRootDirectory + '/app/slack/post-message-slack');
const axios = require('axios');

exports.check = function check() {
    const github = config.github;
    const webmention = config.webmention;
    const webmentionRepo = config.webmentionRepo;

    const urlDestination = `${webmentionRepo.postUrl}/${webmention.lastSentPath}`;
    const options = {
        headers : {
            Authorization : `token ${github.key}`,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        data : {
            branch : webmentionRepo.branch
        }
    };

    logger.info('Checking feed for new Webmentions');
    // logger.info(urlDestination);

    // GET the most recent sent date and the feed of webmentions
    axios.all([
        axios.get(urlDestination, options),
        axios.get(webmention.feed)
    ])
        .then(axios.spread((lastDate, feedItems) => {
            logger.info(lastDate.data.sha);
            logger.info(feedItems.data);

            // Pass this to the parseFeed function
            parseFeed.check(lastDate, feedItems);
        }))
        .catch(function fail(error) {
            logger.error(error);
            logger.info('GIT GET Failed');
            slack.sendMessage('Failed to get feed or last update time, check logs');
        });
};
