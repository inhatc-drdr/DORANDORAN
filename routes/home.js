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
const DB = require("../models/config");
const { resultMSG, resultList } = require("./send");

router.get("/", (req, res) => {

  const user_id = req.user.id;

  console.log(`[${new Date().toLocaleString()}] [uid ${user_id} /home]`);

  // 서버 목록 검색
  // - 서버명, 다음 미팅 날짜
  // - 최근 접속 순

  let sql =
    "SELECT s.srv_id, s.srv_name, " +
    "(SELECT calendar_start FROM calendar c WHERE c.srv_id=s.srv_id and calendar_YN = 'N' and calendar_start >= now() order by calendar_start asc limit 1) as calendar_start " +
    "FROM srvuser su, srv s " +
    "WHERE su.user_id=(?) and su.srv_id = s.srv_id and su.srvuser_YN = 'N' " +
    "order by srvuser_lastaccess desc";

  let params = [user_id];
  DB(sql, params).then(function (result) {
    // return
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      resultList(res, 1, null, result.rows);
    }
  });
});

module.exports = router;
