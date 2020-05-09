/*
POST the found webmention to Telegraph service
https://telegraph.p3k.io/
*/

const logger = require(appRootDirectory + '/app/logging/bunyan');
const axios = require('axios');
const config = require(appRootDirectory + '/app/config.js');
const querystring = require('querystring');

exports.send = function send(source, target) {
    const telegraph = config.telegraph;
    const github = config.github;

    (async () => {
        try {
            const response = axios.post(telegraph.url, querystring.stringify({ token : telegraph.token, source : source, target : target }));
            logger.info('Webmention Sent');
    } catch (error) {
        logger.error(error);
        logger.info('Webmention Send Failed');
    }
  })();
};
