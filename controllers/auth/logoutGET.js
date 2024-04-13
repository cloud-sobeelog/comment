const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { authDB } = require("../../models");

module.exports = async (req, res) => {
    try {
        // 세션에 유저가 존재하는 상태 -> 로그인 중
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) { // 로그아웃 실패
                    return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, responseMessage.LOGOUT_FAIL));
                }

                // 세션 삭제 -> 로그아웃 성공
                return res.status(statusCode.OK)
                .send(util.success(statusCode.OK, responseMessage.LOGOUT_SUCCESS, 0));
            });            
        }
        else { // 로그인하지 않았는데 로그아웃 요청
            return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NEED_LOGIN));
        }
    }
    catch(err) {
        console.log(err);
    }
}