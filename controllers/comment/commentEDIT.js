const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { commentDB } = require("../../models");

module.exports = async (req, res) => {
    try {
        const {commentID, cHistoryID} = req.params;
        const {content, isDeleted} = req.body;

        // isdelete가 true면 유효하지 않은 요청임
        if (isDeleted == false) {
            return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_COMMENT));
        }

        const result = await commentDB.editComment(commentID, cHistoryID, content);
        console.log(result);

        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.UPDATE_ONE_COMMENT_SUCCESS, result));
    }
    catch(err) {
        console.log(err);
    }
}