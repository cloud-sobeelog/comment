const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");

const { consumptionHistoryDB, calendarDB } = require("../../models");

function dateFormat(date) {
    //yyyy-mm-dd 포맷 날짜 생성
    return date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString());
}

module.exports = async (req, res) => {
    try{
        const {cHistoryID} = req.params;
        const result = await consumptionHistoryDB.getConsumptionHistory(cHistoryID);
        const newResult = result[0];
        newResult.date = dateFormat(newResult.date);
        newResult.positiveEmoticonCount = await calendarDB.getCountOfEmoticon(cHistoryID, 0); // 좋아요
        newResult.negativeEmoticonCount = await calendarDB.getCountOfEmoticon(cHistoryID, 1); // 싫어요
        newResult.emoticon = (await calendarDB.getEmoticonByHistoryID(cHistoryID));

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_CONSUMPTION_ID_SUCCESS, newResult));
    }
    catch(err){
        console.log(err)
    }
}