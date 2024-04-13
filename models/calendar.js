const { db } = require("./db");

const getConsumptionHistoryByDate = async(userID, date) => {
    let sql =
    `SELECT ch.cHistoryID, u.nickname writerNickname, u.profile writerProfile, ch.amount, ch.content, ch.category, ch.date
    FROM consumptionHistory ch, user u
    WHERE ch.userID = ${userID} AND u.userID = ch.userID AND ch.date = '${date}'`;
    let [rows, fields] = await db.query(sql);
    return rows;
};


const getCountOfComment = async(cHistoryID) => {
    let sql = `SELECT count(*) count
    FROM comment c
    WHERE c.cHistoryID = ${cHistoryID}`;
    let [rows] = await db.query(sql);
    return rows;
}

const getConsumptionHistoryByMonth = async(month, userID) => {
    let sql = 
    `SELECT DISTINCT date 
    From consumptionHistory 
    WHERE date LIKE '${month}%' 
    AND userID = ${userID}`;
    let [rows,fields] = await db.query(sql);
    console.log(rows);
    return rows
};

// controllers/mycalendar의 montlyCalendarGET에서 호출하는 메서드이지만 프론트에서 호출되지 않는 코드 -> 쓰이지 않으므로 분리할 필요 X
const getCommentAndReactionByMonth = async(month, userID) => {
    let sql = 
    `
    SELECT DISTINCT ch.date FROM consumptionHistory ch, comment c, emoticon e 
    WHERE ch.date LIKE '${month}%'
    AND c.cHistoryID = ch.cHistoryID
    OR e.cHistoryID = ch.cHistoryID 
    AND ch.userID = ${userID}
    ORDER BY ch.date ASC 
    `
    let [rows, fields] = await db.query(sql);
    return rows;
}

const getCalendarFeed = async(userID) => {
    let sql = 
    `
    SELECT ch.cHistoryID, f.user1ID userID, f.user2ID writerID, u.nickname writerNickname, u.profile writerProfile,
    ch.amount, ch.content, ch.category, ch.date 
    FROM consumptionHistory ch, friend f, user u 
    WHERE f.user1ID = ${userID} AND f.user2ID = ch.userID AND f.accepted = 1 AND ch.secret = 0 AND u.userID = f.user2ID 
    ORDER BY ch.date DESC 
    `
    let [rows, fields] = await db.query(sql);
    return rows;
}

const getCountOfEmoticon = async(cHistoryID, category) => {
    let sql = `SELECT COUNT(*) count FROM emoticon 
    WHERE cHistoryID = ${cHistoryID} AND category = ${category}`
    
    let [rows] = await db.query(sql);
    const emoticonCount = rows[0].count;

    return emoticonCount;
}

const getCommentByHistoryID = async(cHistoryID) => {
    let sql = `SELECT c.commentID commentID, c.userID userID, c.content content, c.date date, u.nickname 
    FROM comment c, user u
    WHERE c.cHistoryID = ${cHistoryID} AND c.userID = u.userID`
    let [rows] = await db.query(sql);
    return rows;
}

const getEmoticonByHistoryID = async(cHistoryID) => {
    let sql = `SELECT emoticonID, userID, category
    FROM emoticon e
    WHERE e.cHistoryID = ${cHistoryID}`
    let [rows] = await db.query(sql);
    return rows;
}

const getTotalConsumptionAmount = async(userID, date) => {
    let sql = `SELECT SUM(amount) AS t_amount
    FROM consumptionHistory
    WHERE date = ${date} AND userID = ${userID}`
    let [rows, fields] = await db.query(sql);
    return rows;
}


module.exports = {
    getConsumptionHistoryByDate,
    getConsumptionHistoryByMonth,
    getCommentAndReactionByMonth,
    getCalendarFeed,
    getCountOfComment,
    getCountOfEmoticon,
    getTotalConsumptionAmount,
    getCommentByHistoryID,
    getEmoticonByHistoryID
}