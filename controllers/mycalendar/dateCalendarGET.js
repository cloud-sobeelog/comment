const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { calendarDB } = require("../../models");

function dateFormat(date) {
    return date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? 
    (date.getMonth() + 1).toString() : "0" + (date.getMonth() +1)) 
    + "-" + (date.getDate() > 9 ? date.getDate().toString() : "0"
    + date.getDate().toString());
}

module.exports = async (req, res) => {
    try {
        const { date, userID } = req.params;
        if(!date) {
            return res.status(statusCode.NOT_FOUND).send(util.fail
                (statusCode.NOT_FOUND, responseMessage.NULL_VALUE))
        }
        if(date.length < 10) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail
                (statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE))
        }


        let result = await calendarDB.getConsumptionHistoryByDate(userID,date);
        async function asyncForEach(result) {
            for (let index = 0; index < result.length; index++) {
                result[index].date = dateFormat(result[index].date);
                result[index].comment = (await calendarDB.getCommentByHistoryID(result[index].cHistoryID));
                result[index].comment.forEach(element => element.date = dateFormat(element.date))
                result[index].commentCount = (await calendarDB.getCountOfComment(result[index].cHistoryID))[0].count;
                result[index].emoticon = (await calendarDB.getEmoticonByHistoryID(result[index].cHistoryID));
                result[index].positiveEmoticonCount = (await calendarDB.getCountOfEmoticon(result[index].cHistoryID,0));
                result[index].negativeEmoticonCount = (await calendarDB.getCountOfEmoticon(result[index].cHistoryID,1));
            }
            return result;
        }
        
        const data = await asyncForEach(result);
        return res.status(statusCode.OK).send(util.success
            (statusCode.OK, responseMessage.READ_CONSUMPTION_DATE_SUCCESS, {
                userID: userID,
                result: result
            }));
    }

    catch(err) {
        console.log(err)
    }
}

