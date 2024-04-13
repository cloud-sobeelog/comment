const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { authDB } = require("../../models");
const crypto = require('crypto');

const createHashedPassword = async (password, salt) => 
    new Promise(async (resolve, reject) => {
        crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ hashedPassword: key.toString('base64') });
        });
    });

module.exports = async (req, res) => {
    try {
        const {email, password} = req.body;

        // 세션에 유저가 존재하는 상태 -> 이미 로그인되어 있음.
        if (req.session.user) {
            return res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_LOGIN));
        }

        const result = await authDB.getOneUser(email); // 유저 가져오기

        // 존재하지 않는 이메일
        if (result.length == 0) {
            return res.status(statusCode.BAD_REQUEST)
            .send(util.success(statusCode.BAD_REQUEST, responseMessage.NO_USER));
        }
        const nonStringSalt = result[0].salt.replace('\'','');
        const { hashedPassword } = await createHashedPassword(password, nonStringSalt);
        const datapassword = JSON.stringify(result[0].password);
        const stringPassword = JSON.stringify(hashedPassword);

        // 이메일로 유저를 검색 가능하고, 비밀번호가 같은 경우
        if (stringPassword == datapassword) {
            req.session.user = {
                id: email,
                name: result[0].nickname,
                authorized: true,
            }

            userData = {
                userID: result[0].userID,
                nickname: result[0].nickname,
                email: result[0].email,
            }
            return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, userData));
        }
        else { // 비밀번호 잘못 입력
            return res.status(statusCode.BAD_REQUEST)
            .send(util.success(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));
        }
    }
    catch(err) {
        console.log(err);
    }
}