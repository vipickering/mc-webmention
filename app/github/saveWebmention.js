/*
Write Webmention to the target Repo in the Github API
https://developer.github.com/v3/repos/contents/#create-or-update-a-file
*/

const logger = require(appRootDirectory + '/app/logging/bunyan');
const axios = require('axios');
const base64 = require('base64it');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const targetRepo = config.targetRepo;

exports.write = function write(webmention, fileName, filePath) {
    logger.info(`Raw Webmention ${webmention}`);
    JSON.parse(webmention);
    logger.info(`Webmention parsed ${webmention}`);
    const payloadEncoded = base64.encode(webmention);
    const urlDestination = `${targetRepo.postUrl}/${filePath}/${fileName}`;
    const messageContent = ':robot: Webmention saved';

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
                branch : targetRepo.branch,
                committer : {
                    name : github.user,
                    email : github.email
                }
            }
        };

        const response = await axios(options);
            logger.info(response);
            logger.info('GIT Webmention UPDATE Success');
        } catch (error) {
            logger.error(error);
            logger.error(error.response);
            logger.info(error.response.data.message);
            logger.info('GIT PUT Failed');
        }
      })();
};
