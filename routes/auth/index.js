const express = require('express');
const router = express.Router();

const loginPOST = require('../../controllers/auth/loginPOST');
const logoutGET = require('../../controllers/auth/logoutGET');

router.post('/login', loginPOST);
router.get('/logout', logoutGET);

module.exports = router;