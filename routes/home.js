// ***********************************************************
// HOME API
// ***********************************************************
// @description : 홈 화면
//  - 서버 목록
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 서버 목록
// @todo
//  -
// ***********************************************************

const router = require("express").Router();
const { pool } = require("../models/config");
const { resultMSG, resultList } = require("./send");

router.get("/", async (req, res) => {

  const user_id = req.user.id;

  console.log(`[${new Date().toLocaleString()}] [uid ${user_id} /home]`);

  // 서버 목록 검색
  // - 서버명, 다음 미팅 날짜
  // - 최근 접속 순
  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    let sql =
      "SELECT s.srv_id, s.srv_name, " +
      "(SELECT calendar_start FROM calendar c WHERE c.srv_id=s.srv_id and calendar_YN = 'N' and calendar_start >= now() order by calendar_start asc limit 1) as calendar_start " +
      "FROM srvuser su, srv s " +
      "WHERE su.user_id=(?) and su.srv_id = s.srv_id and su.srvuser_YN = 'N' and s.srv_YN=\'N\' " +
      "order by srvuser_lastaccess desc";
    const sel = await conn.query(
      sql
      , [user_id])

    console.log(sel[0])
    return resultList(res, 1, null, sel[0]);

  } catch (err) {
    console.log(err)
    // await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
});

module.exports = router;
