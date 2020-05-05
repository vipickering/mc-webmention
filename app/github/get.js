/*
Get a file in the Github API
https://developer.github.com/v3/repos/contents/#get-contents
*/

const axios = require('axios');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

exports.get = function get(fileLocation) {
    const urlDestination = `${github.postUrl}/${fileLocation}`;

    const options = {
        headers : {
            Authorization : `token ${github.key}`,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        }
    };

    // axios.get(urlDestination, options)
    //     .then(function processFile(response) {
    //         logger.info(response.data.sha);
    //         return response;
    //     })
    //     .catch(function handleError(error) {
    //         logger.error(error);
    //         logger.info(error.response);
    //         logger.info('GIT GET Failed');
    //     });

    (async () => {
        try {
          const response = await axios.get(urlDestination, options);
          logger.info(response.data.sha);
          return response;
        } catch (error) {
            logger.error(error);
            logger.info(error.response);
            logger.info('GIT GET Failed');
        }
    })();
};
