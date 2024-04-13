const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { commentDB, emoticonDB } = require("../../models");

module.exports = async (req, res) => {
    try {
        const {cHistoryID, userID} = req.params;

        const result = await emoticonDB.getEmoticonByUserID(cHistoryID, userID);
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.GET_EMOTION_BY_USERID, result));
    }
    catch(err) {
        console.log(err);
    }
}