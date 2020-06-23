const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const saveWebmention = require(appRootDirectory + '/app/github/saveWebmention');
const webmentionIO = config.webmentionIO;

exports.webmentionPost = function webmentionPost(req, res) {
    let filePath;
    let webmentionFileName;
    let webmentionId;

    logger.info('Webmention Debug: ' + JSON.stringify(req.body));

    if (req.body.secret === webmentionIO.webhookToken) {
        const webmention = req.body.post;

        const webmentionSelected = (webmentionType) => ({
            'bookmark' : {
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
            'replies' : {
                'filePath' : 'rsvps',
                'webmentionFileName' : 'rsvp'
            },
            'repost' : {
                'filePath' : 'reposts',
                'webmentionFileName' : 'repost'
            }
        })[webmentionType];

        try {
            webmentionSelected(webmention['wm-property']);
            filePath = webmentionSelected.filePath;
            webmentionFileName = webmentionSelected.webmentionFileName;
            logger.info(`Creating Webmention:  ${webmention}`);
            logger.info(`file path:  ${filePath}`);
        } catch (e) {
            filePath = 'unknown';
            webmentionFileName = 'unknown';
        }

        // Test if this is used at all?
        try {
            webmentionId = webmention['wm-id'][0];
            logger.info('Webmention File Name wm-id[0]: ' + webmentionId);
        } catch (e) {
            logger.info('wm-id [0] failed');
        }

        try {
            webmentionId = webmention['wm-id'];
            logger.info('Webmention File Name wm-id: ' + webmentionId);
        } catch (e) {
            logger.info('wm-id failed');
        }

        const fileName = `${webmentionFileName}_${webmentionId}.json`;

        saveWebmention.write(webmention, fileName, filePath);
    } else {
        res.status(400);
        res.send('Secret incorrect');
    }
};
