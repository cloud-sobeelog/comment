const { db } = require("./db");

// 해당 유저가 공감하기를 했는지, 어떤 것을 공감했는지 확인하기 위한 코드
const isUserEmoticon = async(cHistoryID, userID, category) => {
    let sql = `SELECT *
                FROM emoticon 
                WHERE cHistoryID = ${cHistoryID} AND userID = ${userID} AND category=${category}`;

    let [rows, fields] = await db.query(sql);
    console.log(rows);

    return rows;
}

const isCheckedAnotherOne = async(cHistoryID, userID, category) => {
    let sql = `SELECT * FROM emoticon 
    WHERE cHistoryID = ${cHistoryID} AND userID = ${userID} AND category=${category}`;

    let [rows, fields] = await db.query(sql);

    return rows;
}

// 좋아요/ 싫어요 공감하기(추가하기)
const postEmoticon = async(cHistoryID, userID, category) => {
    let sql = `INSERT INTO emoticon
    (cHistoryID, userID, category)
    VALUES (${cHistoryID}, ${userID}, ${category})`;

    let [rows, fields] = await db.query(sql);

    return rows;
}

// 좋아요/ 싫어요 공감 취소하기(삭제하기)
const deleteEmoticon = async(cHistoryID, userID) => {
    let sql = `DELETE FROM emoticon
    WHERE cHistoryID = ${cHistoryID} AND userID = ${userID}`;

    let [rows, fields] = await db.query(sql);

    return rows;
}

const deleteEmoticonAnotherCategory = async(cHistoryID, userID, newCategory) => {       // newCategory = !BoolCategory
    console.log(newCategory);
    let sql = `DELETE FROM emoticon
    WHERE cHistoryID = ${cHistoryID} AND userID = ${userID} AND category=${newCategory}`;

    let [rows, fields] = await db.query(sql);

    return rows;
}

const getEmoticonByUserID = async(cHistoryID, userID) => {
    let sql = `SELECT category FROM emoticon WHERE cHistoryID = ${cHistoryID} AND userID = ${userID}`;

    let [rows, fields] = await db.query(sql);

    return rows;
}

module.exports = {
    isUserEmoticon,
    isCheckedAnotherOne,
    postEmoticon,
    deleteEmoticon,
    deleteEmoticonAnotherCategory,
    getEmoticonByUserID
}