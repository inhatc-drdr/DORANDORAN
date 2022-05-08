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
const DB = require("../models/config");
const { resultMSG, resultList } = require("../app");
const { srvRequired } = require("./required");

// 회원 조회
router.get("/", srvRequired, (req, res) => {

  const user_id = req.user.id;
  const srv_id = req.query.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server/member] srv_id=${srv_id}`
  );

  const admin_yn = req.data.admin_yn;
  if (admin_yn == "n") {
    return resultMSG(res, -1, "접근 권한이 없습니다.");
  }

  let sql =
    "SELECT su.user_id, user_name, user_email, user_tel, srvuser_lastaccess " +
    "FROM srvuser su, user u " +
    "WHERE srv_id=? and su.user_id = u.user_id and su.user_id!=? and srvuser_YN = 'N' and user_YN  = 'N' " +
    "ORDER BY user_name";
  let params = [srv_id, user_id];
  DB(sql, params).then(function (result) {
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      resultList(res, 1, result.rows);
      // res.send({
      //   result: 1,
      //   list: result.rows,
      // });
    }
  });
});

// 회원 삭제
router.post("/delete", srvRequired, (req, res) => {

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
    resultMSG(res, -1, "관리자는 삭제 불가능합니다.");
  } else {
    // 삭제하고자하는 멤버가 서버의 멤버인지 확인
    let sql =
      "SELECT srvuser_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN='N'";
    let params = [srv_id, delete_id];
    DB(sql, params).then(function (result) {
      if (!result.state) {
        console.log(result.err);
        resultMSG(res, -1, "오류가 발생하였습니다.");
      } else {
        if (!result.rows[0]) {
          resultMSG(res, -1, "서버에 존재하지 않은 멤버입니다.");
        } else {
          const srvuser_id = result.rows[0].srvuser_id;

          // 멤버 삭제
          sql =
            "UPDATE srvuser SET srvuser_YN='Y', srvuser_leave=CURRENT_TIMESTAMP where srvuser_id=?";
          params = [srvuser_id];

          DB(sql, params).then(function (result) {
            if (!result.state) {
              console.log(result.err);
              resultMSG(res, -1, "오류가 발생하였습니다.");
            } else {
              resultMSG(res, -1, "멤버가 삭제되었습니다.");
            }
          });
        }
      }
    });
  }
});

// 회원 초대
router.post("/invent", srvRequired, (req, res) => {

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

  let sql = "SELECT user_id FROM user WHERE user_email=? AND user_yn='N'";
  let params = [invent_email];
  DB(sql, params).then(function (result) {
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      if (!result.rows[0]) {
        resultMSG(res, -1, "오류가 발생하였습니다.");
      } else {
        const invent_id = result.rows[0].user_id;

        // 관리자 자신은 초대 불가능
        if (invent_id == user_id) {
          resultMSG(res, -1, "관리자는 초대 불가능합니다.");
        } else {
          // 초대하고자 하는 멤버가 이미 회원인지 확인
          sql =
            "SELECT srvuser_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN='N'";
          params = [srv_id, invent_id];
          DB(sql, params).then(function (result) {
            if (!result.state) {
              console.log(result.err);
              resultMSG(res, -1, "오류가 발생하였습니다.");
            } else {
              if (result.rows[0]) {
                resultMSG(res, -1, "이미 가입된 멤버입니다.");
              } else {
                // 멤버 초대
                sql = "INSERT INTO srvuser(srv_id, user_id) VALUES(?, ?)";
                params = [srv_id, invent_id];

                DB(sql, params).then(function (result) {
                  if (!result.state) {
                    console.log(result.err);
                    resultMSG(res, -1, "오류가 발생하였습니다.");
                  } else {
                    resultMSG(res, 1, "멤버가 초대되었습니다.");
                    // res.send({
                    //   result: 1,
                    //   msg: "멤버가 초대되었습니다.",
                    // });
                  }
                });
              }
            }
          });
        }
      }
    }
  });
});

module.exports = router;
