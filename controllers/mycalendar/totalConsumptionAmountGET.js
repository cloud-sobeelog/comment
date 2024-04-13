const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { calendarDB } = require("../../models");

function dateFormat(date) {
    return date.getFullYear() + ((date.getMonth() + 1) > 9 ? 
    (date.getMonth() + 1).toString() : "0" + (date.getMonth() +1)) 
    + (date.getDate() > 9 ? date.getDate().toString() : "0"
    + date.getDate().toString());
}

module.exports = async (req, res) => {
    try {
        const date  = req.query.date;
        if(!date) {
            return res.status(statusCode.NOT_FOUND).send(util.fail
                (statusCode.NOT_FOUND, responseMessage.NULL_VALUE))
        }
        // date값이 하이픈 없이 YYYYMMDD 형식으로 들어와야 에러 X
        if(date.length < 8) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail
                (statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE))
        }

        const { userID } = req.query;
        let totalAmount = await calendarDB.getTotalConsumptionAmount(userID, date);

        const data = {
            amount: totalAmount
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK,
            responseMessage.READ_CALENDAR_DATE_TOTAL_AMOUNT, data));

        
    }
    catch(err) {
        console.log(err)
    }
}