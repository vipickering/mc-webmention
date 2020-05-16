const express = require('express');
const router = new express.Router();
const serviceProfile = require(appRootDirectory + '/app/data/serviceProfile.json');

/***
GET Routes
***/
router.get('/', (req, res) => {
    res.json(serviceProfile);
});

/***
POST Routes
***/

module.exports = router;
