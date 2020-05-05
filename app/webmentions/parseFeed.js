const logger = require(appRootDirectory + '/app/logging/bunyan');
const base64 = require('base64it');
// const webmentions = require(appRootDirectory + '/app/webmentions/send');
const lastFetchDate = require(appRootDirectory + '/app/github/update');

exports.check = function check(lastDate, feedItems) {
    const decodedDate = base64.decode(lastDate.data.content);
    const parsedData = JSON.parse(decodedDate);
    // logger.info(lastDate.data.sha);
    // logger.info(decodedDate);
    // logger.info(parsedData.time);
    // logger.info(feedItems.data);

    const webmentionItems = feedItems.data;

    let item;
    let tempTime = 0;

    const lastSentTime = parsedData.time;

    logger.info(`last sent at ${lastSentTime}`);

    for (item in webmentionItems) {
        if (webmentionItems.hasOwnProperty(item)) {
            if (webmentionItems[item].date > lastSentTime) {
                logger.info(`${webmentionItems[item].source} on date ${webmentionItems[item].date} sending to ${webmentionItems[item].target}`);
                // webmentions.send(item);
                tempTime = webmentionItems[item].date; // Update the temp variable
            }
        }
    }

    // Check to see if we sent any webmentions by checking if the tempTime has been updated.
    if (tempTime > lastSentTime) {
        const payload = `{"time" : "${tempTime}"}`;
        logger.info(`Updating webmention last sent time to ${tempTime}`);
        lastFetchDate.update(payload, lastDate.data.sha);
    } else {
        logger.info('No Webmentions found');
    }
};
