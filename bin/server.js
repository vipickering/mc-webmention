const express = require('express');
require('dotenv').config();
const favicon = require('serve-favicon');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');

appRootDirectory = path.join(__dirname, '/..');
const config = require(appRootDirectory + '/app/config.js');
const logger = require(appRootDirectory + '/app/logging/bunyan');
// const webmentions = require(appRootDirectory + '/app/webmentions/check');
const routes = require(appRootDirectory + '/app/routes.js');

const api = config.api;
// const webmention = config.webmention;
const port = api.port;
const app = express();

app.use(helmet());
app.use(favicon('public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use('/', routes);

// Setup interval timer
// const intervalMins = webmention.interval;
// const interval = intervalMins * 60 * 1000;

// Let's log how often we are checking webmentions
// logger.info(`Checking for Webmentions every ${intervalMins} minutes`);

// The interval function runs every X mins to check the JSON feed for new webmentions to send.
// setInterval(function intervalTimer() {
//     logger.info('Checking feed for new Webmentions');
//     webmentions.check();
// }, interval);

const server = app.listen(process.env.PORT || port, function serveTheThings() {
    logger.info('MC Send Webmention Online Port:%s...', server.address().port);
});
