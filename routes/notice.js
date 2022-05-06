// ***********************************************************
// NOTICE API
// ***********************************************************
// @description : 공지 관련 라우터
//  - 공지 등록 조회, 상세
// @date : 2022-05-06
// @modifier : 노예원
// @did
//  - 
// @todo
//  - 
// ***********************************************************

const router = require("express").Router();
const DB = require("../models/config");
const { resultMSG } = require("../app");
const { srvRequired } = require("./required");

router.get("/", srvRequired, (req, res) => {

    const user_id = req.body.id;
    const srv_id = req.query.srv_id;
    const notice_id = req.query.n_id || 0;

    console.log(
        `[${new Date().toLocaleString()}] [uid ${user_id} /server/notice] srv_id=${srv_id}&n_id=${notice_id}`
    );

    // 상세 조회
    if (notice_id) {
        return noticeDetail(notice_id, res);
    }

    // 목록 조회
    return noticeList(srv_id, res);
})

// 목록 조회
function noticeList(srv_id, res) {

    let sql =
        'SELECT notice_id as n_id, notice_name as n_name, notice_write as n_write '
        + 'FROM notice '
        + 'WHERE srv_id=? and notice_YN=\'N\'';
    let params = [srv_id];
    DB(sql, params).then(function (result) {
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
        } else {

            res.send({
                result: 1,
                list: result.rows,
            });
            return;
        }
    });
}

// 상세 조회
function noticeDetail(notice_id, res) {

    let sql =
        'select user_name, notice_name, notice_memo, notice_write '
        + 'FROM notice n, user u WHERE notice_id=? and n.user_id=u.user_id and notice_YN=\'N\'';
    let params = [notice_id];
    DB(sql, params).then(function (result) {
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
        } else {

            if (!result.rows[0]) {
                return resultMSG(res, -1, "존재하지 않는 공지입니다.");
            }

            res.send({
                result: 1,
                list: result.rows[0],
            });
            return;
        }
    });
}

// 일정 추가
router.post("/add", srvRequired, (req, res) => {

    const user_id = req.user.id;
    const srv_id = req.body.srv_id;

    console.log(
        `[${new Date().toLocaleString()}] [uid ${user_id} /server/notice/add] srv_id=${srv_id}`
    );

    const admin_yn = req.data.admin_yn;
    if (admin_yn == "n") {
        return resultMSG(res, -1, "접근 권한이 없습니다.");
    }

    const notice_name = req.body.n_name;
    const notice_memo = req.body.n_memo;

    let sql =
        'INSERT INTO notice '
        + '(srv_id, user_id, notice_name, notice_memo) '
        + 'VALUES(?,?,?,?)';
    let params = [srv_id, user_id, notice_name, notice_memo];
    DB(sql, params).then(function (result) {
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
        } else {
            resultMSG(res, 1, "추가되었습니다.");
        }
    });

})

module.exports = router;
