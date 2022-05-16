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
const DB = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { hashCreate, hashCheck } = require("../config/crypto");

router.get("/", (req, res) => {

  const user_id = req.user.id;

  console.log(`[${new Date().toLocaleString()}] [uid ${user_id} /setting] `);

  let sql =
    "SELECT user_email, user_name FROM user WHERE user_id=(?) and user_YN  = 'N'";
  let params = [user_id];
  DB(sql, params).then(function (result) {
    // return
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {

      if (!result.rows.length) {
        return resultMSG(res, -1, "불러올 수 없습니다.");
      }

      resultList(res, 1, null, result.rows);
    }
  });
});

router.post("/name", (req, res) => {
  const user_id = req.user.id;
  const name = req.body.name;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /setting/name] name=${name}`
  );

  let sql = "UPDATE user SET user_name=? WHERE user_id=?";
  let params = [name, user_id];
  DB(sql, params).then(function (result) {
    // return
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      resultMSG(res, 1, "이름이 변경되었습니다.");
    }
  });
});

router.post("/msg", (req, res) => {
  const user_id = req.user.id;
  const msg = req.body.msg;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /setting/msg] msg=${msg}`
  );

  let sql = "UPDATE user SET user_msg=? WHERE user_id=?";
  let params = [msg, user_id];
  DB(sql, params).then(function (result) {
    // return
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      resultMSG(res, 1, "상태메시지가 변경되었습니다.");
    }
  });
});

// 비밀번호 변경
router.post("/changePassword", (req, res) => {
  const user_id = req.user.id;
  let pwd = req.body.pwd;
  let changePwd = req.body.changePwd;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /setting/changePassword] pwd=${pwd}&changePwd=${changePwd}`
  );


  if (!pwd || !changePwd) {
    return resultMSG(res, -1, "오류가 발생하였습니다.");

  } else {
    // login check
    let sql = 'SELECT count(*) as count, user_pwd, user_salt FROM user WHERE user_id=? AND user_YN=\'N\'';
    let params = [user_id];
    DB(sql, params).then((result) => {

      if (!result.state) {
        console.log(result.err);

      } else {
        if (!result.rows[0]) {

        } else {
          const user_pwd = result.rows[0].user_pwd;
          const user_salt = result.rows[0].user_salt;

          if (!user_pwd || !user_salt) {
            return resultMSG(res, -1, "오류가 발생하였습니다.");

          } else {

            // 복호화
            const crypto_pwd = hashCheck(user_salt, pwd);

            if (user_pwd == crypto_pwd) {

              // 암호화
              const hashed = hashCreate(changePwd);

              const salt = hashed.salt;
              const crypto_pwd = hashed.pwd;

              let sql =
                "UPDATE user SET user_pwd=?, user_salt=? WHERE user_id=? AND user_YN=\'N\'";
              let params = [crypto_pwd, salt, user_id];
              DB(sql, params).then(function (result) {
                // return
                if (!result.state) {
                  console.log(result.err);
                  resultMSG(res, -1, "오류가 발생하였습니다.");
                } else {
                  resultMSG(res, 1, "비밀번호가 변경되었습니다.");
                }
              });

            } else {
              return resultMSG(res, -1, "기존 비밀번호가 일치하지 않습니다.");
            }
          }
        }
      }
    })
  }
})

module.exports = router;
