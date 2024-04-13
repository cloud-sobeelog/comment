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
        // TODO: userID 헤더로 받아서 getCalendarFeed 인자로 넘겨줘야함.
        const {userID} = req.params;
        let result = await calendarDB.getCalendarFeed(userID);
        async function asyncForEach(result) {
            for (let index = 0; index < result.length; index++) {
                result[index].date = dateFormat(result[index].date);
                result[index].commentCount = (await calendarDB.getCountOfComment(result[index].cHistoryID))[0].count;
                result[index].positiveEmoticonCount = (await calendarDB.getCountOfEmoticon(result[index].cHistoryID,0));
                result[index].negativeEmoticonCount = (await calendarDB.getCountOfEmoticon(result[index].cHistoryID,1));
                result[index].comment = (await calendarDB.getCommentByHistoryID(result[index].cHistoryID));    
                result[index].comment.forEach(element => element.date = dateFormat(element.date))            
                result[index].emoticon = (await calendarDB.getEmoticonByHistoryID(result[index].cHistoryID));
            }
            return result;
        }
        
        const feedList = await asyncForEach(result);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIEND_CALENDAR_SUCCESS, {
            userID: userID,
            feedList: feedList
        }));
    }
    catch(err){
        console.log(err)
    }
}