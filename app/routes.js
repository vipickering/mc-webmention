const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');
const webmentionPostRoute = require(appRootDirectory + '/app/webmentions/receive/save');

/***
GET Routes
***/
router.get('/', (req, res) => {
    res.json(serviceProfile);
});

/***
POST Routes
***/
router.post('/post-webmention', webmentionPostRoute.webmentionPost);

module.exports = router;
