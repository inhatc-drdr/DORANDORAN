// ***********************************************************
// SERVER API
// ***********************************************************
// @description : 서버 기능
//  - 서버 접속, 공지, 일정 등 확인
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 서버 접속
// @todo
//  -
// ***********************************************************

const router = require("express").Router();
const { pool } = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { srvRequired } = require("./required");

// 서버 접속
router.get("/", srvRequired, async (req, res) => {
  const user_id = req.user.id;
  const srv_id = req.query.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} GET /server] srv_id=${srv_id}`
  );

  const srvuser_id = req.data.srvuser_id;
  const admin_yn = req.data.admin_yn;

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    const upd = await conn.query(
      "UPDATE srvuser SET srvuser_lastaccess=CURRENT_TIMESTAMP WHERE srvuser_id=?"
      , [srvuser_id])

    console.log(
      `[${new Date().toLocaleString()}] [retrun ] {result:1, admin_yn:${admin_yn}}`
    );

    res.send({
      result: 1,
      admin_yn: admin_yn,
    });
    return;

  } catch (err) {
    console.log(err)
    // await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
});

// 서버 접속
router.get("/info", srvRequired, async (req, res) => {
  const user_id = req.user.id;
  const srv_id = req.query.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} GET /server/info] srv_id=${srv_id}`
  );

  const admin_yn = req.data.admin_yn;

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    const sel = await conn.query(
      "SELECT user_name, srv_name FROM user u, srv WHERE u.user_id=? AND srv_id=? AND srv_YN=\'N\' AND user_YN=\'N\'"
      , [user_id, srv_id])

    if (!sel[0][0]) {
      throw new Error("존재하지 않은 멤버 또는 서버");
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
});

// 서버 생성
router.post("/", async (req, res) => {
  const user_id = req.user.id;
  const srv_name = req.body.srv_name;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} POST /server] srv_name=${srv_name}`
  );

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction() // 트랜잭션 적용 시작

    // 자신이 만든 서버 중 해당 서버가 존재하는지 확인
    const sel = await conn.query(
      "SELECT count(*) as count FROM srv WHERE srv_name=? and user_id=?"
      , [srv_name, user_id])

    console.log(sel[0][0].count)

    if (sel[0][0].count != 0) {
      return resultMSG(res, -1, "이미 존재하는 서버입니다.");
    }

    // 서버 추가
    const ins = await conn.query(
      "INSERT INTO srv (srv_name, user_id) VALUES(?,?)"
      , [srv_name, user_id])


    // 관리자를 서버 회원 목록에 추가
    const ins2 = await conn.query(
      "INSERT INTO srvuser (srv_id, user_id) VALUES("
      + " (SELECT srv_id FROM srv WHERE srv_name=? and user_id=?), ?)"
      , [srv_name, user_id, user_id])

    await conn.commit() // 커밋

    return resultMSG(res, 1, "서버가 생성되었습니다.");

  } catch (err) {
    console.log(err)
    await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
});

module.exports = router;
