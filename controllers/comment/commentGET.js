const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const axios = require('axios');

const { commentDB } = require("../../models");
const { client } = require("../../lib/api");


module.exports = async (req, res) => { // req에 요청값이 담긴다.
    try {
        const {cHistoryID} = req.params; // {} 안의 것을 req에서 뽑아온다.
        const result = await commentDB.getComment(cHistoryID);  // comment에 대한 정보 얻기
        console.log(result);
        
        // 댓글이 없는 경우
        if (result.length == 0) {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_COMMENT_SUCCESS, result));
        }
        
        for (var i = 0; i < result.length; i++) {
            // console.log(result[i]);
            // console.log(result[i].userID);
            const userID = result[i].userID;

            const { data } = await client.get(`/user/userInfo/${userID}`);
            result[i].nickname = data.data[0].nickname;
            //console.log(findData.commentID);
        }

        //console.log(data);
        //console.log(data.data[0]);
        //console.log(data.data[0].userID);
        //console.log(data.data[0].nickname);
        
        return res.status(statusCode.OK)    // 뷰로 result보냄
        .send(util.success(statusCode.OK, responseMessage.READ_ALL_COMMENT_SUCCESS, result));
    }
    catch(err) {
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}