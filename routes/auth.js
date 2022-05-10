// ***********************************************************
// AUTH API
// ***********************************************************
// @description : 유저 관련 라우터
//  - 로그인, 회원가입, 이메일 중복확인, 로그아웃, 회원탈퇴
// @date : 2022-05-02
// @modifier : 노예원
// @did
//  - 
// @todo
//  - 로그인 시 이메일 대소문자 구별 오류 해결 필요
// ***********************************************************

const router = require("express").Router();
const DB = require("../models/config");
const { hashCreate, hashCheck } = require("../config/crypto");
const { resultMSG } = require("./send");

const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken, authenticateAccessToken } = require('./jwt');

// 로그인
router.post("/login", (req, res) => {
  let email = req.body.email;
  let pwd = req.body.pwd;

  console.log(
    `[${new Date().toLocaleString()}] [uid - /login] email=${email}&pwd=${pwd}`
  );

  if (!email || !pwd) {
    return resultMSG(res, -1, "이메일 또는 비밀번호가 입력되지 않았습니다.");

  } else {
    // login check
    let sql = 'SELECT count(*) as count, user_id, user_name, user_pwd, user_salt FROM user WHERE user_email=? AND user_YN=\'N\'';
    let params = [email];
    DB(sql, params).then((result) => {

      if (!result.state) {
        console.log(result.err);

      } else {
        if (!result.rows[0]) {

        } else {
          const user_pwd = result.rows[0].user_pwd;
          const user_salt = result.rows[0].user_salt;

          if (!user_pwd || !user_salt) {
            return resultMSG(res, -1, "이메일 또는 비밀번호가 일치하지 않습니다.");

          } else {

            // 복호화
            const crypto_pwd = hashCheck(user_salt, pwd);

            if (user_pwd == crypto_pwd) {

              const user_id = result.rows[0].user_id;

              let accessToken = generateAccessToken(user_id);
              let refreshToken = generateRefreshToken(user_id);

              // 성공 시 토큰 전송
              console.log(
                `[${new Date().toLocaleString()}] [retrun ] {result:1, msg:"로그인 되었습니다", accessToken:${accessToken}, refreshToken:${refreshToken}}`
              );

              return res.send({
                "reuslt": 1,
                "msg": "로그인 되었습니다.",
                accessToken,
                refreshToken
              });

            } else {
              return resultMSG(res, -1, "이메일 또는 비밀번호가 일치하지 않습니다.");
            }
          }
        }
      }
    })
  }
})

// access token을 refresh token 기반으로 재발급
router.post("/refresh", (req, res) => {

  let refreshToken = req.body.refreshToken;

  console.log(
    `[${new Date().toLocaleString()}] [uid - /refresh] refreshToken=${refreshToken}`
  );

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, user) => {
      if (error) return res.sendStatus(403);

      const accessToken = generateAccessToken(user.id);

      res.json({ accessToken });
    }
  );
});

// 로그아웃 -> 클라이언트에서 토큰 삭제

// 회원가입
router.post("/signup", (req, res) => {
  const account = req.body;
  const name = account.name;
  const email = account.email;
  const pwd = account.pwd;
  const tel = account.tel;

  console.log(
    `[${new Date().toLocaleString()}] [uid - /signup] name=${name}&email=${email}&pwd=${pwd}&tel=${tel}`
  );

  // 암호화
  const hashed = hashCreate(pwd);

  const salt = hashed.salt;
  const crypto_pwd = hashed.pwd;

  let sql =
    "INSERT INTO user (user_name, user_email, user_pwd, user_tel, user_salt) VALUES(?,?,?,?,?)";
  let params = [name, email, crypto_pwd, tel, salt];
  DB(sql, params).then(function (result) {
    // return
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      resultMSG(res, 1, "회원가입이 완료되었습니다.");
    }
  });
});

// 이메일 중복확인
router.post("/emailCheck", (req, res) => {
  const account = req.body;
  const email = account.email;

  console.log(`[${new Date().toLocaleString()}] [uid - /emailCheck] email=${email}`);

  let sql = "SELECT count(*) as count FROM user WHERE user_email = ?";
  let params = [email];
  DB(sql, params).then(function (result) {
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      let count = result.rows[0].count;
      if (!count) {
        resultMSG(res, 1, "사용가능한 이메일 입니다.");
      } else {
        resultMSG(res, -1, "중복된 이메일입니다.");
      }
    }
  });
});

// 회원탈퇴
router.post("/signout", authenticateAccessToken, (req, res) => {

  const user_id = req.user.id;

  console.log(`[${new Date().toLocaleString()}] [uid ${user_id} /signout] `);

  const pwd = req.body.pwd;

  let sql =
    "SELECT count(*) as count, user_pwd, user_salt FROM user WHERE user_id=? AND user_YN='N'";
  let params = [user_id];
  DB(sql, params).then((result) => {
    // return
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      let count = result.rows[0].count;
      if (!count) {
        resultMSG(res, -1, "탈퇴에 실패하였습니다.");
      } else {
        const user_pwd = result.rows[0].user_pwd;
        const user_salt = result.rows[0].user_salt;

        // 복호화
        const crypto_pwd = hashCheck(user_salt, pwd);

        if (user_pwd == crypto_pwd) {
          // db
          sql =
            "UPDATE user SET user_YN='Y', user_leave=CURRENT_TIMESTAMP where user_id=?";
          DB(sql, params).then((result) => {
            if (!result.state) {
              console.log(result.err);
              resultMSG(res, -1, "오류가 발생하였습니다.");
            } else {
              resultMSG(res, 1, "탈퇴가 완료되었습니다.");
            }
          });
        } else {
          resultMSG(res, -1, "탈퇴에 실패하였습니다.");
        }
      }
    }
  });
});

module.exports = router;
