const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const userController = require("../user/userNicknameGET");
const { commentDB } = require("../../models");

module.exports = async (req, res) => { // req에 요청값이 담긴다.
    try {
        const {cHistoryID} = req.params; // {} 안의 것을 req에서 뽑아온다.
        const result = await commentDB.getComment(cHistoryID);  // comment에 대한 정보 얻기\
        result.nickname = await userController(result.userId);

        
        return res.status(statusCode.OK)    // 뷰로 result보냄
        .send(util.success(statusCode.OK, responseMessage.READ_ALL_COMMENT_SUCCESS, result));
    }
    catch(err) {
        console.log(err);
    }
}