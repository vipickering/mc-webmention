/*
POST content to the Github API
*/

const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

exports.publish = function publish(fileLocation, fileName, responseLocation, payload, commitMessage) {
    const payloadEncoded = base64.encode(payload);
    const fileDestination = `${github.postUrl}/contents/${fileLocation}/${fileName}`;
    const messageContent = `:robot: ${commitMessage}`;
    const options = {
        method : 'PUT',
        url : fileDestination,
        headers : {
            Authorization : `token ${github.key}`,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        body : {
            path : fileName,
            branch : github.branch,
            message : messageContent,
            committer : {
                'name' : github.user,
                'email' : github.email
            },
            content : payloadEncoded
        },
        json :  true
    };

    function successful() {
        logger.info('Git creation successful!');
    }

    function githubError(err) {
        logger.info('POST to Github API Failed');
        logger.error(err);
    }

    rp(options)
        .then(successful)
        .catch(githubError);
};
