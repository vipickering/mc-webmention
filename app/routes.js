const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const receiveWebmention = require(appRootDirectory + '/app/webmentions/receive/save');
const findWebmentions = require(appRootDirectory + '/app/security/check');
const tokenChallenge = require(appRootDirectory + '/app/webmentions/token');

/***
GET Routes
***/
router.get('/', (req, res) => {
    res.json(serviceProfile);
});

/***
POST Routes
***/
router.post('/post-webmention', receiveWebmention.webmentionPost);
router.post('/check-webmention/:token', tokenChallenge.challenge, findWebmentions.check);

module.exports = router;
