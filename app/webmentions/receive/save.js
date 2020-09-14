const logger = require(appRootDirectory + '/app/logging/bunyan');
const saveWebmention = require(appRootDirectory + '/app/github/saveWebmention');
const slack = require(appRootDirectory + '/app/slack/post-message-slack');

exports.webmentionPost = function webmentionPost(req, res) {
    let filePath;
    let webmentionFileName;
    let webmentionId;
    const webmention = req.body.post;
    const webmentionTypeReceived = webmention['wm-property'];
    const webmentionType = {
        'bookmark-of' : {
            'filePath' : 'bookmarks',
            'webmentionFileName' : 'bookmark'
        },
        'like-of' : {
            'filePath' : 'likes',
            'webmentionFileName' : 'like'
        },
        'mention-of' : {
            'filePath' : 'mentions',
            'webmentionFileName' : 'mention'
        },
        'in-reply-to' : {
            'filePath' : 'replies',
            'webmentionFileName' : 'reply'
        },
        'rsvp' : {
            'filePath' : 'rsvps',
            'webmentionFileName' : 'rsvp'
        },
        'repost-of' : {
            'filePath' : 'reposts',
            'webmentionFileName' : 'repost'
        }
    };

    // 1. Get the webmention type and assign it the extra properties we need
    const webmentionProperties = webmentionType[webmentionTypeReceived];

    // 2. Wrap in a try/catch just in case something went wrong, then we can just assign an 'unknown' value and manually fix later
    // TEMP code to monitor wrapped in an try/catch
    try { // Is Swarm sending these?
        webmentionId = webmention['wm-id'][0];
    } catch (e) {
        slack.sendMessage('Webmention save wm-id [0] failed ');
        logger.info('wm-id [0] failed');
    }

    try {
        webmentionId = webmention['wm-id'];
    } catch (e) {
        slack.sendMessage('Webmention save wm-id failed ');
        logger.info('wm-id failed');
    }
    // End TEMP Code

    try {
        filePath = webmentionProperties.filePath;
        webmentionFileName = webmentionProperties.webmentionFileName;
    } catch (e) {
        filePath = 'unknown';
        webmentionFileName = 'unknown';
    }

    // 3. Now we have worked that out we can create the file name and assign the file path when saving in Github
    const fileName = `${webmentionFileName}_${webmentionId}.json`;
    saveWebmention.write(webmention, fileName, filePath);
    slack.sendMessage('Webmention saved');
};
