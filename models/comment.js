const { db } = require("./db");

/*
댓글 보기 (로드밸런서(서비스)를 통해 user파드와 통신 필요)
user서비스에게 userID값을 GET요청 보냄
user서비스는 해당 userID의 nickname을 응답으로 보냄
*/

// const getComment = async(cHistoryID) => {
//     let sql = `SELECT c.commentID commentID, c.cHistoryID cHistoryID, c.userID userID, c.content content, c.date date, c.replyID replyID, c.isDeleted isDeleted, u.nickname nickname
//     FROM comment c, user u
//     WHERE cHistoryID = ${cHistoryID} AND u.userID = c.userID AND c.isDeleted=false`;
//     let [rows, fields] = await db.query(sql);

//     return rows;
// };

// 수정
const getComment = async(cHistoryID) => {
    let sql = `SELECT c.commentID commentID, c.cHistoryID cHistoryID, c.userID userID, c.content content, c.date date, c.replyID replyID, c.isDeleted isDeleted
    FROM comment c
    WHERE cHistoryID = ${cHistoryID} AND c.isDeleted=false`;
    let [rows, fields] = await db.query(sql);

    return rows;
};




// 특정 댓글의 정보 가져오기
const getOneComment = async(commentID) => {
    let sql = `SELECT * FROM comment WHERE commentID = ${commentID}`;
    let [rows, fields] = await db.query(sql);

    return rows;
};

// 대댓글 입력과 댓글 입력은 replyID로 구분한다.
const postComment = async(cHistoryID, userID, content, replyID) => {
    let sql = `INSERT INTO comment
    (cHistoryID, userID, content, date, replyID)
    VALUES (${cHistoryID}, ${userID}, ${content}, NOW(), ${replyID})`;

    let [rows, fields] = await db.query(sql);
    console.log(rows);
};



// 댓글 수정
const editComment = async(commentID, cHistoryID, content) => {
    let sql = `UPDATE comment 
    SET content = ${content} 
    WHERE commentID = ${commentID} AND cHistoryId = ${cHistoryID}`;

    let [rows, fields] = await db.query(sql);

    console.log(rows);
};

// 댓글 삭제 (정말로 데이터베이스에서 지우는 것이 아님, isDeleted 값을 바꾼다.)
const deleteComment = async(commentID, cHistoryID) => {
    let sql = `UPDATE comment 
    SET content = "삭제된 댓글입니다.", isDeleted = true
    WHERE commentID = ${commentID} AND cHistoryId = ${cHistoryID}`;

    let [rows, fields] = await db.query(sql);

    console.log(rows);
};

const getCountOfComment = async(cHistoryID) => {
    let sql = `SELECT COUNT(*) count
    FROM comment c
    WHERE c.cHistoryID = ${cHistoryID}`;

    let [rows] = await db.query(sql);

    return rows;
}



module.exports = {
    getComment,
    getOneComment,
    postComment,
    editComment,
    deleteComment,
    getCountOfComment
}