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
const { pool } = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { srvRequired } = require("./required");

router.get("/", srvRequired, (req, res) => {

    const user_id = req.user.id;
    const srv_id = req.query.srv_id;
    const calendar_id = req.query.c_id || 0;
    const admin_yn = req.data.admin_yn;

    console.log(
        `[${new Date().toLocaleString()}] [uid ${user_id} /server/calendar] srv_id=${srv_id}&c_id=${calendar_id}`
    );

    // 상세 조회
    if (calendar_id) {
        return calendarDetail(calendar_id, admin_yn, res);
    }

    // 목록 조회
    return calendarList(srv_id, admin_yn, res);
})

// 목록 조회
async function calendarList(srv_id, admin_yn, res) {
    const conn = await pool.getConnection();
    try {
        // await conn.beginTransaction() // 트랜잭션 적용 시작

        let sql =
            'SELECT calendar_id as c_id, calendar_start as c_start, calendar_end as c_end, calendar_memo as c_memo '
            + 'FROM calendar WHERE srv_id=? and calendar_YN =\'N\'';
        const sel = await conn.query(
            sql
            , [srv_id])

        console.log(sel[0])
        return resultList(res, 1, admin_yn, sel[0]);

    } catch (err) {
        console.log(err)
        // await conn.rollback() // 롤백
        // return res.status(500).json(err)
        resultMSG(res, -1, "오류가 발생하였습니다.");

    } finally {
        conn.release() // conn 회수
    }
}

// 상세 조회
async function calendarDetail(calendar_id, admin_yn, res) {
    const conn = await pool.getConnection();
    try {
        // await conn.beginTransaction() // 트랜잭션 적용 시작

        let sql =
            'SELECT calendar_start c_start, calendar_end c_end, calendar_memo c_memo, video_id '
            + 'FROM calendar WHERE calendar_id=? and calendar_YN =\'N\'';
        const sel = await conn.query(
            sql
            , [calendar_id])

        if (!sel[0][0]) {
            return resultList(res, -1, admin_yn, "존재하지 않는 일정입니다.");
        }

        console.log(sel[0])
        return resultList(res, 1, admin_yn, sel[0]);

    } catch (err) {
        console.log(err)
        // await conn.rollback() // 롤백
        // return res.status(500).json(err)
        resultMSG(res, -1, "오류가 발생하였습니다.");

    } finally {
        conn.release() // conn 회수
    }
}

// 일정 추가
router.post("/add", srvRequired, async (req, res) => {

    const user_id = req.user.id;
    const srv_id = req.body.srv_id;

    const calendar_start = req.body.c_start;    // 2022-06-01T10:50:00
    const calendar_end = req.body.c_end;        // 2022-06-01T12:35:00
    const calendar_memo = req.body.c_memo;
    const video_id = new Date().getTime().toString(36);

    console.log(
        `[${new Date().toLocaleString()}] [uid ${user_id} /server/calendar/add] srv_id=${srv_id}&
            calendar_start=${calendar_start}&calendar_end=${calendar_end}&calendar_memo=${calendar_memo}&video_id=${video_id}`
    );

    const admin_yn = req.data.admin_yn;
    if (admin_yn == "n") {
        return resultMSG(res, -1, "접근 권한이 없습니다.");
    }

    const conn = await pool.getConnection();
    try {
        // await conn.beginTransaction() // 트랜잭션 적용 시작

        let sql =
            'INSERT INTO calendar '
            + '(srv_id, user_id, calendar_start, calendar_end, calendar_memo, video_id) '
            + 'VALUES(?,?,?,?,?,?)';
        const ins = await conn.query(
            sql
            , [srv_id, user_id, calendar_start, calendar_end, calendar_memo, video_id])

        return resultMSG(res, 1, "추가되었습니다.");

    } catch (err) {
        console.log(err)
        // await conn.rollback() // 롤백
        // return res.status(500).json(err)
        return resultMSG(res, -1, "오류가 발생하였습니다.");

    } finally {
        conn.release() // conn 회수
    }
})

module.exports = router;
