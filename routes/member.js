// ***********************************************************
// SERVER API (ADMIN)
// ***********************************************************
// @description : 서버 내 회원 관련 기능
//  - 회원 관리, 추가
// @date : 2022-04-30
// @modifier : 노예원
// @did
//  - 회원 조회, 삭제, 초대 완료
// @todo
//  -
// ***********************************************************

const router = require("express").Router();
const { pool } = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { srvRequired } = require("./required");

// 회원 조회
router.get("/", srvRequired, async (req, res) => {

  const user_id = req.user.id;
  const srv_id = req.query.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server/member] srv_id=${srv_id}`
  );

  const admin_yn = req.data.admin_yn;
  if (admin_yn == "n") {
    return resultMSG(res, -1, "접근 권한이 없습니다.");
  }

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    let sql =
      "SELECT su.user_id, user_name, user_email, user_tel, srvuser_lastaccess " +
      "FROM srvuser su, user u " +
      "WHERE srv_id=? and su.user_id = u.user_id and su.user_id!=? and srvuser_YN = 'N' and user_YN  = 'N' " +
      "ORDER BY user_name";
    const sel = await conn.query(
      sql
      , [srv_id, user_id])

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

// 회원 삭제
router.post("/delete", srvRequired, async (req, res) => {

  const user_id = req.user.id;
  const delete_id = req.body.user_id;
  const srv_id = req.body.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server/member/delete] srv_id=${srv_id}&delete_id=${delete_id}`
  );

  const admin_yn = req.data.admin_yn;
  if (admin_yn == "n") {
    return resultMSG(res, -1, "접근 권한이 없습니다.");
  }

  // 관리자 자신은 삭제 불가능
  if (delete_id == user_id) {
    return resultMSG(res, -1, "관리자는 삭제 불가능합니다.");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction() // 트랜잭션 적용 시작

    // 삭제하고자하는 멤버가 서버의 멤버인지 확인
    const sel = await conn.query(
      "SELECT srvuser_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN='N'"
      , [srv_id, delete_id])

    if (!sel[0][0]) {
      throw new Error("존재하지 않은 멤버");
    }

    const srvuser_id = sel[0][0].srvuser_id;

    const del = await conn.query(
      "UPDATE srvuser SET srvuser_YN='Y', srvuser_leave=CURRENT_TIMESTAMP where srvuser_id=?"
      , [srvuser_id])

    await conn.commit() // 커밋

    return resultMSG(res, -1, "멤버가 삭제되었습니다.");

  } catch (err) {
    console.log(err)
    await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
});

// 회원 초대
router.post("/invent", srvRequired, async (req, res) => {

  const user_id = req.user.id;
  const invent_email = req.body.user_email;
  const srv_id = req.body.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server/member/invent] srv_id=${srv_id}&invent_email=${invent_email}`
  );

  const admin_yn = req.data.admin_yn;
  if (admin_yn == "n") {
    return resultMSG(res, -1, "접근 권한이 없습니다.");
  }

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    // 초대하고자하는 멤버의 id 검색
    const sel = await conn.query(
      "SELECT user_id FROM user WHERE user_email=? AND user_yn='N'"
      , [invent_email])

    if (!sel[0][0]) {
      throw new Error("존재하지 않은 멤버");
    }

    const invent_id = sel[0][0].user_id;

    if (invent_id == user_id) {
      return resultMSG(res, -1, "관리자는 초대 불가능합니다.");
    }

    // 초대하고자 하는 멤버가 이미 회원인지 확인
    const sel2 = await conn.query(
      "SELECT srvuser_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN='N'"
      , [srv_id, invent_id])

    if (!sel2[0][0]) {
      return resultMSG(res, -1, "이미 가입된 멤버입니다.");
    }

    // 멤버 초대
    const ins = await conn.query(
      "INSERT INTO srvuser(srv_id, user_id) VALUES(?, ?)"
      , [srv_id, invent_id])

    // await conn.commit() // 커밋

    return resultMSG(res, 1, "멤버가 초대되었습니다.");

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
