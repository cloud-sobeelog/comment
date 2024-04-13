const { db } = require("./db");

// 유저 검색
const getOneUser = async(email) => {
    let sql = `SELECT * FROM user WHERE email = ${email}`;

    let [rows, fields] = await db.query(sql);

    console.log(rows);

    return rows;
};

module.exports = {
    getOneUser
}