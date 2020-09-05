/*eslint no-process-env: "off"*/
const config = {};

config.github = {
    'host' : process.env.GITHUB_HOST,
    'key' : process.env.GITHUB_KEY,
    'name' : process.env.GITHUB_NAME,
    'user' : process.env.GITHUB_USER,
    'email' : process.env.GITHUB_USER_EMAIL
};

config.webmentionRepo = {
    'repo' : process.env.WEBMENTION_REPO,
    'branch' : process.env.WEBMENTION_BRANCH,
    'postUrl' : process.env.GITHUB_HOST + '/repos/' + process.env.GITHUB_NAME + '/' + process.env.WEBMENTION_REPO + '/contents'
};

config.targetRepo = {
    'repo' : process.env.TARGET_REPO,
    'branch' : process.env.TARGET_BRANCH,
    'postUrl' : process.env.GITHUB_HOST + '/repos/' + process.env.GITHUB_NAME + '/' + process.env.TARGET_REPO + '/contents/src/_data'
};

config.api = {
    'port' : process.env.API_PORT
};

config.webmention = {
    'feed' : process.env.WEBMENTION_FEED,
    'interval' : process.env.INTERVAL_DURATION,
    'lastSentPath' : process.env.WEBMENTION_PATH,
    'token' : process.env.WEBMENTION_ROUTE_TOKEN
};

config.webmentionIO = {
    'webhookToken' : process.env.WEBMENTIONIO_WEBHOOK_TOKEN
};

config.telegraph = {
    'token' : process.env.TELEGRAPH_TOKEN,
    'url' : process.env.TELEGRAPH_URL
};

config.slack = {
    'token' : process.env.SLACK_TOKEN
};

module.exports = config;
