const logger = require(appRootDirectory + '/app/logging/bunyan');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');
const fs = require('fs');

exports.checkDate = function checkDate(feedItems) {
    const lastFetch = fs.readFileSync(appRootDirectory + '/data/lastFetchDate.json');
    const lastSent = JSON.parse(lastFetch);
    const lastSentTime = lastSent.time;
    logger.info(`last sent at ${lastSentTime}`);

    // Configure Github options to update Feed date
    const fileName = 'lastFetchDate.json';
    const fileLocation = '/contents/data/';
    const responseLocation = fileLocation;
    const webmentions = JSON.parse(feedItems);
    let payload;
    let item;
    let tempTime = 0;

    for (item in webmentions) {
        if (webmentions.hasOwnProperty(item)) {
            if (webmentions[item].date > lastSentTime) {
                // Send webmention
                logger.info(`Webmention in article ${webmentions[item].source} on date ${webmentions[item].date} requires sending to ${webmentions[item].target}`);
                // TODO: Code to send webmention HERE!

                // Update temp time to the current post time
                tempTime = webmentions[item].date;
                logger.info(`Updating to the New Sent Time of: ${tempTime}`);
            }
        }
    }

    // Check to see if we sent any webmentions by checking if the tempTime has been updated.
    if (tempTime > lastSentTime) {
        // Now we need to update the file
        payload = `{"time": "${tempTime}"}`;
        logger.info(`Updating webmention last sent time in Github to ${tempTime}`);
        // Push the update file back to github
        // githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload); <- Need to sort out routing!!
    } else {
        logger.info('No Webmentions found');
    }

};
