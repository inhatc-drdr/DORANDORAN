const { pool } = require("../models/config");
const { resultMSG } = require("./send");

// 서버 접근 가능 여부 확인
export async function srvRequired(req, res, next) {

    const user_id = req.user.id;
    const srv_id = req.query.srv_id || req.body.srv_id;

    const conn = await pool.getConnection();
    try {
        // await conn.beginTransaction() // 트랜잭션 적용 시작

        const sel = await conn.query(
            "SELECT srvuser_id, s.user_id as admin_id FROM srvuser su, srv s WHERE su.srv_id=? AND su.user_id=? AND su.srv_id = s.srv_id AND srvuser_YN=\'N\'"
            , [srv_id, user_id])

        if (!sel[0][0]) {
            return resultMSG(res, -1, "접근 권한이 없습니다.");
        }

        let admin_id = result.rows[0].admin_id;
        req.data = {
            srvuser_id: result.rows[0].srvuser_id,
            admin_yn: (admin_id == user_id ? "y" : "n"),
        };

        next();

    } catch (err) {
        console.log(err)
        // await conn.rollback() // 롤백
        // return res.status(500).json(err)
        return resultMSG(res, -1, "오류가 발생하였습니다.");

    } finally {
        conn.release() // conn 회수
    }
}