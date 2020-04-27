const express = require('express');
require('dotenv').config();
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rp = require('request-promise');

appRootDirectory = path.join(__dirname, '/..');
const config = require(appRootDirectory + '/app/config.js');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const lastSent = require(appRootDirectory + '/app/webmentions/check-date');

const api = config.api;
const webmention = config.webmention;
const port = api.port;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());

// Setup interval timer
const intervalMins = webmention.interval;
const interval = intervalMins * 60 * 1000;

function githubFeedError(err) {
    logger.info('Feed not availale');
    logger.error(err);
    res.status(400);
    res.send('Feed GET failed');
}

// Let's log how often we are checking webmentions
logger.info(`Checking for available Webmentions every ${intervalMins} minutes`);

setInterval(function intervalTimer() {
    logger.info('Checking feed for new Webmentions');

    rp(webmention.feed)
        .then(lastSent.checkDate)
        .catch(githubFeedError);
}, interval);

const server = app.listen(process.env.PORT || port, function serveTheThings() {
    logger.info('MC Send Webmention Online Port:%s...', server.address().port);
});
