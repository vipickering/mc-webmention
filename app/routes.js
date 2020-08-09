const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const receiveWebmention = require(appRootDirectory + '/app/webmentions/receive/save');
const findWebmentions = require(appRootDirectory + '/app/webmentions/check');
const tokenChallenge = require(appRootDirectory + '/app/webmentions/token');
/***
GET Routes
***/
router.get('/check-webmention/:token', tokenChallenge.challenge, findWebmentions.check);

router.get('/', (req, res) => {
    res.json(serviceProfile);
});

/***
POST Routes
***/
router.post('/post-webmention', receiveWebmention.webmentionPost);

module.exports = router;
