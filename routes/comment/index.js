const express = require('express');
const commentGET = require('../../controllers/comment/commentGET');
const commentPOST = require('../../controllers/comment/commentPOST');
const commentDELETE = require('../../controllers/comment/commentDELETE');
const commentEDIT = require('../../controllers/comment/commentEDIT');
const router = express.Router();

router.get('/:cHistoryID', commentGET); // 전체 댓글 보기
router.post('/:cHistoryID', commentPOST); // 댓글 작성
router.put('/:cHistoryID/:commentID', commentEDIT); // 댓글 수정
router.put('/:cHistoryID/:commentID', commentDELETE); // 댓글 삭제
module.exports = router;