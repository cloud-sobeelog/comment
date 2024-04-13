const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { calendarDB } = require("../../models");

function dateFormat(date) {
    //yyyy-mm-dd 포맷 날짜 생성
    return date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString());
}

module.exports = async (req, res) => {
    try{
        const { month,userID } = req.params;

        if(!month){
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NULL_VALUE))
        }
        if(month.length < 7){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE))
        }
        // INFO: 월별 소비내역 있는 날 date 리스트 반환
        const result = await calendarDB.getConsumptionHistoryByMonth(month, userID);
        const c_historyDateList = [];
        result.forEach(element => {
            c_historyDateList.push(dateFormat(element.date));
        });

        // INFO: 월별 소비내역에 댓글이나 반응 있는 날 date 리스트 반환
        const reactDateList = [];
        const resResult = await calendarDB.getCommentAndReactionByMonth(month, userID);
        resResult.forEach(element => {
            reactDateList.push(dateFormat(element.date))
        })

        const data = {
            c_historyDateList: c_historyDateList,
            reactDateList: reactDateList
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_CALENDAR_DATE_SUCCESS, data));
    }
    catch(err){
        console.log(err)
    }
}