const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { commentDB } = require("../../models");

module.exports = async (req, res) => {
    try {
        const {commentID, cHistoryID} = req.params;

        const result = await commentDB.deleteComment(commentID, cHistoryID);

        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.DELETE_ONE_COMMENT_SUCCESS, result));
    }
    catch(err) {
        console.log(err);
    }
}