const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { commentDB, emoticonDB } = require("../../models");

module.exports = async (req, res) => {
    try {
        const {cHistoryID} = req.params;
        let {userID, category} = req.body;
        let BoolCategory=Boolean(parseInt(category));

        // 이미 좋아요 또는 싫어요를 했는지 확인 (이미 공감을 한 소비내역인지 확인)
        const check = await emoticonDB.isUserEmoticon(cHistoryID, userID, BoolCategory);
        const ifCheckAnotherOne = await emoticonDB.isCheckedAnotherOne(cHistoryID, userID, !BoolCategory);

        // 이미 좋아요를 누른 사용자는 더이상 좋아요를 누를 수 없게 확인하는 조건문
        if(check.length != 0){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMOTICON_EXIST));
        }

        // 싫어요를 누른 사용자가 좋아요로 바꾸고 싶을때 
        else if(ifCheckAnotherOne.length != 0){ //싫어요에서 좋아요로 바꾸는 경우
            await emoticonDB.deleteEmoticonAnotherCategory(cHistoryID, userID, !BoolCategory);
            const result = await emoticonDB.postEmoticon(cHistoryID, userID, BoolCategory);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CHANGE_EMOTION_SUCCESS, result));
        }

        else { // 아직 좋아요/ 싫어요를 하지 않은 경우
            const result = await emoticonDB.postEmoticon(cHistoryID, userID, BoolCategory);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.ADD_EMOTICON_SUCCESS, result));
        }
    }
    catch(err) {
        console.log(err);
    }
}