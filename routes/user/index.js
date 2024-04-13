const express = require('express');
const joinPOST = require('../../controllers/user/joinPOST');
const router = express.Router();

router.post('/join',joinPOST);

module.exports = router;