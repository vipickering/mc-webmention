const express = require('express');
require('dotenv').config();
const favicon = require('serve-favicon');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');

appRootDirectory = path.join(__dirname, '/..');
const config = require(appRootDirectory + '/app/config.js');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const routes = require(appRootDirectory + '/app/routes.js');

const api = config.api;
const port = api.port;
const app = express();

app.use(helmet());
app.use(favicon('public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use('/', routes);

const server = app.listen(process.env.PORT || port, function serveTheThings() {
    logger.info('mc-webmention Online Port:%s...', server.address().port);
});
