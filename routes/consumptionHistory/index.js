const express = require('express');
const consumptionHistoryGET = require('../../controllers/consumptionHistory/consumptionHistoryGET');
const consumptionHistoryPOST = require('../../controllers/consumptionHistory/consumptionHistoryPOST');
const router = express.Router();

router.get('/:cHistoryID',consumptionHistoryGET);
router.post('/',consumptionHistoryPOST);
module.exports = router; 