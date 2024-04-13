const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { userDB } = require("../../models");
const { db } = require("../../db");
const crypto = require('crypto');

const createSalt = async() => 
  new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
          if (err) reject(err);
          resolve(buf.toString('base64'));
      });
  });

const createHashedPassword = async (password) => 
    new Promise(async (resolve, reject) => {
      const salt = await createSalt();
      crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
          if (err) reject(err);
          resolve({ newpassword: key.toString('base64'), salt });
      });
  });
;

module.exports = async (req, res) => {
    const { email, password, password2, nickname } = req.body;
    console.log(email);
    try {
      if (email && password && password2 && nickname) {
          const result = await userDB.checkUser(email);
          console.log(result.length);
          if(result.length <= 0 && password == password){
            const {newpassword, salt} = await createHashedPassword(password);
            const joinSuccess = await userDB.postJoin(email, 
             JSON.stringify(newpassword), nickname, JSON.stringify(salt));
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CREATED_USER))
          }
          else if(password != password2){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.DIFFRERENT_PASSWORD))
          }
          else{
            return res.status(statusCode.CREATED).send(util.fail(statusCode.CREATED, responseMessage.ALREADY_EMAIL))
          }
      } else {        // 입력되지 않은 정보가 있는 경우
          return res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, responseMessage.NULL_VALUE));
      }

    } catch (error) {
      console.error("회원가입 실패:", error);
      return res.status(statusCode.BAD_REQUEST).send(responseMessage.INTERNAL_SERVER_ERROR);
    }
  };