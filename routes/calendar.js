// ***********************************************************
// CALENDAR API
// ***********************************************************
// @description : 일정 관련 라우터
//  - 일정 등록 조회, 상세
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

    const user_id = req.user.id;
    const srv_id = req.query.srv_id;
    const calendar_id = req.query.c_id || 0;

    console.log(
        `[${new Date().toLocaleString()}] [uid ${user_id} /server/calendar] srv_id=${srv_id}&c_id=${calendar_id}`
    );

    // 상세 조회
    if (calendar_id) {
        return calendarDetail(calendar_id, res);
    }

    // 목록 조회
    return calendarList(srv_id, res);
})

// 목록 조회
function calendarList(srv_id, res) {

    let sql =
        'SELECT calendar_id as c_id, calendar_start as c_start, calendar_end as c_end, calendar_memo as c_memo '
        + 'FROM calendar WHERE srv_id=? and calendar_YN =\'N\'';
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
function calendarDetail(calendar_id, res) {

    let sql =
        'SELECT calendar_start c_start, calendar_end c_end, calendar_memo c_memo, video_id '
        + 'FROM calendar WHERE calendar_id=? and calendar_YN =\'N\'';
    let params = [calendar_id];
    DB(sql, params).then(function (result) {
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
        } else {

            if (!result.rows[0]) {
                return resultMSG(res, -1, "존재하지 않는 일정입니다.");
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
        `[${new Date().toLocaleString()}] [uid ${user_id} /server/calendar/add] srv_id=${srv_id}`
    );

    const admin_yn = req.data.admin_yn;
    if (admin_yn == "n") {
        return resultMSG(res, -1, "접근 권한이 없습니다.");
    }

    const calendar_start = req.body.c_start;    // 2022-06-01T10:50:00
    const calendar_end = req.body.c_end;        // 2022-06-01T12:35:00
    const calendar_memo = req.body.c_memo;
    // const video_id = `S${srv_id}U${user_id}V${calendar_start.split()[0].slice(-2)}${calendar_end.split()[0].slice(-2)}`;
    const video_id = new Date().getTime().toString(36);

    let sql =
        'INSERT INTO calendar '
        + '(srv_id, user_id, calendar_start, calendar_end, calendar_memo, video_id) '
        + 'VALUES(?,?,?,?,?,?)';
    let params = [srv_id, user_id, calendar_start, calendar_end, calendar_memo, video_id];
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
