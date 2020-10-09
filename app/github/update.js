/*
Update or Create the last date file in the Github API
https://developer.github.com/v3/repos/contents/#create-or-update-a-file
*/

const logger = require(appRootDirectory + '/app/logging/bunyan');
const axios = require('axios');
const base64 = require('base64it');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const webmention = config.webmention;
const webmentionRepo = config.webmentionRepo;
const slack = require(appRootDirectory + '/app/slack/post-message-slack');

exports.update = function update(payload, sha) {
    logger.info(payload);
    const payloadEncoded = base64.encode(payload);
    const urlDestination = `${webmentionRepo.postUrl}/${webmention.lastSentPath}`;
    const messageContent = ':robot: last sent datetime updated';

    logger.info(urlDestination);

    (async () => {
        try {
        const options = {
            method : 'PUT',
            url : urlDestination,
            headers : {
                Authorization : `token ${github.key}`,
                'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                'User-Agent' : github.name
            },
            data : {
                message : messageContent,
                content : payloadEncoded,
                sha : sha,
                branch : webmentionRepo.branch,
                committer : {
                    name : github.user,
                    email : github.email
                }
            }
        };
        logger.info(options);
        const response = await axios(options);
            logger.info(response);
            logger.info('GIT UPDATE Success');
            slack.sendMessage('Webmention last sent time saved');
        } catch (error) {
            // logger.error(error);
            logger.error(error.response);

            logger.info(error.response.data.message);
            logger.info('GIT PUT Failed');
            slack.sendMessage('Webmention last sent time Failed, check logs');
        }
      })();
};
