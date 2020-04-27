/*eslint no-process-env: "off"*/
const config = {};

config.api = {
    'port' : process.env.API_PORT
};

config.webmention = {
    'feed' : process.env.WEBMENTION_FEED,
    'interval' : process.env.INTERVAL_DURATION
};

config.website = {
    'url' : process.env.WEBSITE_URL
};

config.telegraph = {
    'token' : process.env.TELEGRAPH_TOKEN,
    'url' : process.env.TELEGRAPH_URL
};

module.exports = config;
