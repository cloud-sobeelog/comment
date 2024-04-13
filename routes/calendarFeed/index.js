const express = require('express');
const router = express.Router();
const calendarFeedGET = require('../../controllers/calendarFeed/calendarFeedGET');

router.get('/:userID',calendarFeedGET);

module.exports = router; 