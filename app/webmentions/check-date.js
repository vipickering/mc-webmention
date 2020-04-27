const logger = require(appRootDirectory + '/app/logging/bunyan');
// const githubApi = require(appRootDirectory + '/app/github/post-to-api');
const fs = require('fs');

exports.checkDate = function checkDate(feedItems) {
    const lastFetch = fs.readFileSync(appRootDirectory + '/data/lastFetchDate.json');
    const lastSent = JSON.parse(lastFetch);
    const lastSentTime = lastSent.time;
    logger.info(`last sent at ${lastSentTime}`);
    // logger.info('I am running');
    // logger.info(feedItems);

    // Configure Github options to update Feed date
    const fileName = 'lastFetchDate.json';
    const fileLocation = '/contents/data/';
    const responseLocation = fileLocation;
    const webmentions = JSON.parse(feedItems);
    let payload;
    let lastSentValue;
    let item;

    for (item in webmentions) {
        if (webmentions.hasOwnProperty(item)) {
            logger.info(webmentions[item].date);
            logger.info(webmentions[item].source);
            logger.info(webmentions[item].target);
        }
    }

    // if () {
    //     // If it isn't, stop looping. (for each feed item?)
    //     // If it is, send the webmention target and source url to Telegraph
    //     // Once all items sent.

    //     // - update the date-time to (the most recent feed item + 1 minute).
    //     // payload = `{"time": "${lastSentValue}"}`;
    //     // githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload);
    // } else {
    //     logger.info('No Webmentions to send');
    //     res.status(200);
    //     res.send('Done');
    // }
};
