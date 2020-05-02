const fs = require('fs');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const rp = require('request-promise');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');
const telegraph = config.telegraph;

exports.webmention = function webmention(feedItems) {
    const lastFetch = fs.readFileSync(appRootDirectory + '/data/lastFetchDate.json');
    const lastSent = JSON.parse(lastFetch);
    const lastSentTime = lastSent.time;
    logger.info(`last sent at ${lastSentTime}`);

    // Configure Github options to update Feed date
    const fileName = 'lastFetchDate.json';
    const fileLocation = 'data';
    const responseLocation = fileLocation;
    const webmentions = JSON.parse(feedItems);
    let payload;
    let item;
    let tempTime = 0;
    // const telegraphOptions = {
    //     method : 'POST',
    //     uri : telegraph.url,
    //     headers : {
    //         'User-Agent' : 'MC-Webmention'
    //     },
    //     form : {
    //         token : telegraph.token,
    //         source : webmentions[item].source,
    //         target : webmentions[item].target
    //     }
    // };

    function updateWebmentionPubDate() {
        // Update temp time to the current post time
        tempTime = webmentions[item].date;
        logger.info(`Updating to the New Sent Time of: ${tempTime}`);
    }

    function webmentionPublishError(err) {
        logger.info('Webmentions send to Telegraph failed');
        logger.error(err);
        // res.status(400);
        // res.send('Update failed');
    }

    for (item in webmentions) {
        if (webmentions.hasOwnProperty(item)) {
            if (webmentions[item].date > lastSentTime) {
                logger.info(`Webmention in article ${webmentions[item].source} on date ${webmentions[item].date} requires sending to ${webmentions[item].target}`);

                tempTime = webmentions[item].date;
                logger.info(`Updating to the New Sent Time of: ${tempTime}`);
                // POST webmention to telegraph, then update the temp value for the date.
                // rp(telegraphOptions)
                //     .then(updateWebmentionPubDate)
                //     .catch(webmentionPublishError);
            }
        }
    }

    // Check to see if we sent any webmentions by checking if the tempTime has been updated.
    if (tempTime > lastSentTime) {
        // Now we need to update the file
        payload = `{"time": "${tempTime}"}`;
        logger.info(`Updating webmention last sent time in Github to ${tempTime}`);
        // Push the update file back to github
        githubApi.publish(fileLocation, fileName, responseLocation, payload, 'last sent datetime updated'); // Need to sort out routing!!
    } else {
        logger.info('No Webmentions found');
    }
};
