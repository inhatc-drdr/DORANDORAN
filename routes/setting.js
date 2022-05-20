// ***********************************************************
// SETTING API
// ***********************************************************
// @description : 설정 화면
//  - 프로필 설정, 비밀번호 변경
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 비밀번호 변경
// @todo
//  -
// ***********************************************************

const router = require("express").Router();
const { pool } = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { hashCreate, hashCheck } = require("../config/crypto");

router.get("/", async (req, res) => {

  const user_id = req.user.id;

  console.log(`[${new Date().toLocaleString()}] [uid ${user_id} GET /setting] `);

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    const sel = await conn.query(
      "SELECT user_email, user_name FROM user WHERE user_id=(?) and user_YN  = 'N'"
      , [user_id])

    if (!sel[0][0]) {
      throw new Error("존재하지 않은 정보");
    }

    // await conn.commit() // 커밋

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

router.put("/name", async (req, res) => {
  const user_id = req.user.id;
  const name = req.body.name;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} PUT /setting/name] name=${name}`
  );

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    const upd = await conn.query(
      "UPDATE user SET user_name=? WHERE user_id=?"
      , [name, user_id])

    // await conn.commit() // 커밋

    return resultMSG(res, 1, "이름이 변경되었습니다.");

  } catch (err) {
    console.log(err)
    // await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
});

router.put("/msg", async (req, res) => {
  const user_id = req.user.id;
  const msg = req.body.msg;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} PUT /setting/msg] msg=${msg}`
  );

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    const upd = await conn.query(
      "UPDATE user SET user_msg=? WHERE user_id=?"
      , [msg, user_id])

    // await conn.commit() // 커밋

    return resultMSG(res, 1, "상태메시지가 변경되었습니다.");

  } catch (err) {
    console.log(err)
    // await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
});

// 비밀번호 변경
router.put("/pwd", async (req, res) => {
  const user_id = req.user.id;
  let pwd = req.body.pwd;
  let changePwd = req.body.changePwd;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} PUT /setting/pwd] pwd=${pwd}&changePwd=${changePwd}`
  );


  if (!pwd || !changePwd) {
    return resultMSG(res, -1, "오류가 발생하였습니다.");

  }

  const conn = await pool.getConnection();
  try {
    // await conn.beginTransaction() // 트랜잭션 적용 시작

    const sel = await conn.query(
      "SELECT user_pwd, user_salt FROM user WHERE user_id=? AND user_YN=\'N\'"
      , [user_id])

    if (!sel[0][0]) {
      throw new Error("존재하지 않은 멤버");
    }

    const user_pwd = sel[0][0].user_pwd;
    const user_salt = sel[0][0].user_salt;

    if (!user_pwd || !user_salt) {
      throw new Error("존재하지 않은 정보");
    }

    // 복호화
    const crypto_pwd = hashCheck(user_salt, pwd);

    if (user_pwd != crypto_pwd) {
      throw new Error("유효하지 않은 정보");
    }

    // 암호화
    const hashed = hashCreate(changePwd);
    const salt = hashed.salt;
    const hashed_pwd = hashed.pwd;

    const upd = await conn.query(
      "UPDATE user SET user_pwd=?, user_salt=? WHERE user_id=? AND user_YN=\'N\'"
      , [hashed_pwd, salt, user_id])

    // await conn.commit() // 커밋

    return resultMSG(res, 1, "비밀번호가 변경되었습니다.");

  } catch (err) {
    console.log(err)
    // await conn.rollback() // 롤백
    // return res.status(500).json(err)
    resultMSG(res, -1, "오류가 발생하였습니다.");

  } finally {
    conn.release() // conn 회수
  }
})

module.exports = router;
