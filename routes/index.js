const express = require('express');
const router = express.Router();

router.use('/mycalendar', require('./mycalendar'));
router.use('/consumptions',require('./consumptionHistory')); 
router.use('/comment', require('./comment'));
router.use('/calendarfeed',require('./calendarFeed'));
router.use('/friends', require('./friends'));
router.use('/emoticon', require('./emoticon'));
router.use('/user',require('./user'));
router.use('/auth', require('./auth'));
module.exports = router;