const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const saveWebmention = require(appRootDirectory + '/app/github/saveWebmention');
const webmentionIO = config.webmentionIO;

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

    if (req.body.secret === webmentionIO.webhookToken) {
        // Log request and WM properties  so easy to find
        logger.info('Webmention Debug: ' + JSON.stringify(req.body));
        logger.info(`Webmention Properties: ${webmentionTypeReceived} `);

        // 1. Get the webmention type and assign it the extra properties we need
        const webmentionProperties = webmentionType[webmentionTypeReceived];

        // 2. Wrap in a try/catch just in case something went wrong, then we can just assign an 'unknown' value and manually fix later
        // TEMP code to monitor wrapped in an try/catch
        try { // Is Swarm sending these?
            webmentionId = webmention['wm-id'][0];
        } catch (e) {
            logger.info('wm-id [0] failed');
        }

        try {
            webmentionId = webmention['wm-id'];
        } catch (e) {
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
    } else {
        logger.info('authorisation failed');
        res.status(400);
        res.send('Secret incorrect');
    }
};
