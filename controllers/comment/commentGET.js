const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const axios = require('axios');

const userController = require("../user/userNicknameGET");
const { commentDB } = require("../../models");
const { client } = require("../../lib/api");



// axios.get('http://localhost:8081/comment', {
//     params: {
//         cHistoryID: 113
//     }
// })
// .then(function (response) {
//     console.log(response.data);
// })
// .catch(function (error) {
//     console.log(error);
// });

module.exports = async (req, res) => { // req에 요청값이 담긴다.
    try {
        const {cHistoryID} = req.params; // {} 안의 것을 req에서 뽑아온다.
        const result = await commentDB.getComment(cHistoryID);  // comment에 대한 정보 얻기\
        console.log(result);
        // data에 user정보가 안담김
        // params로 받아야함
        
        const userID = result[0].userID;

        const { data } = await client.get(`/user/userInfo/${userID}`);
        result[0].nickname = data.data[0].nickname;

        // console.log(data.data[0]);
        // console.log(data.data[0].userID);
        // console.log(data.data[0].nickname);

        // console.log(result.nickname);
        console.log(result);
        
        return res.status(statusCode.OK)    // 뷰로 result보냄
        .send(util.success(statusCode.OK, responseMessage.READ_ALL_COMMENT_SUCCESS, result));
    }
    catch(err) {
        console.log(err);
    }
}