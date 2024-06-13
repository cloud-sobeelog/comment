const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");

const { commentDB } = require("../../models");
const { client } = require("../../lib/api");

module.exports = async (req, res) => {
    try {
        const { cHistoryID } = req.params;
        const result = await commentDB.getComment(cHistoryID);
        console.log(result);

        if (result.length === 0) {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_COMMENT_SUCCESS, result));
        }

        // 모든 사용자 ID를 배열로 추출
        const userIDs = result.map(comment => comment.userID);

        // 병렬로 사용자 정보를 가져오기
        const userRequests = userIDs.map(userID => client.get(`/user/userInfo/${userID}`));
        const userResponses = await Promise.all(userRequests);

        // 사용자 정보를 결과에 병합
        userResponses.forEach((response, index) => {
            const nickname = response.data.data[0].nickname;
            result[index].nickname = nickname;
        });

        console.log(result);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_COMMENT_SUCCESS, result));
    } catch (err) {
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
};
