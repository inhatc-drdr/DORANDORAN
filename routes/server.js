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
const { DB } = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { srvRequired } = require("./required");

// 서버 접속
router.get("/", srvRequired, (req, res) => {
  const user_id = req.user.id;
  const srv_id = req.query.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server] srv_id=${srv_id}`
  );

  const srvuser_id = req.data.srvuser_id;
  const admin_yn = req.data.admin_yn;

  // 접속 시간 저장
  let sql =
    "UPDATE srvuser SET srvuser_lastaccess=CURRENT_TIMESTAMP WHERE srvuser_id=?";
  let params = [srvuser_id];
  DB(sql, params).then(function (result) {
    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {

      console.log(
        `[${new Date().toLocaleString()}] [retrun ] {result:1, admin_yn:${admin_yn}}`
      );

      res.send({
        result: 1,
        admin_yn: admin_yn,
      });
      return;
    }
  });
});

// 서버 생성
router.post("/add", (req, res) => {
  const user_id = req.user.id;
  const srv_name = req.body.srv_name;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server/add] srv_name=${srv_name}`
  );

  // 자신이 만든 서버 중 해당 서버가 존재하는지 확인
  let sql = "SELECT count(*) as count FROM srv WHERE srv_name=? and user_id=?";
  let params = [srv_name, user_id];
  DB(sql, params).then(function (result) {
    console.log(result);

    if (!result.state) {
      console.log(result.err);
      resultMSG(res, -1, "오류가 발생하였습니다.");
    } else {
      if (result.rows[0].count) {
        resultMSG(res, -1, "이미 존재하는 서버입니다.");
      } else {
        // 서버 추가
        sql = "INSERT INTO srv (srv_name, user_id) VALUES(?,?)";
        DB(sql, params).then(function (result) {
          if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
          } else {
            // 관리자를 서버 회원 목록에 추가
            sql =
              "INSERT INTO srvuser (srv_id, user_id) VALUES(" +
              " (SELECT srv_id FROM srv WHERE srv_name=? and user_id=?), ?)";
            params = [srv_name, user_id, user_id];
            DB(sql, params).then(function (result) {
              if (!result.state) {
                console.log(result.err);

                // 실패시 추가된 서버도 삭제
                sql =
                  "UPDATE srv SET srv_YN='Y', srv_delete=CURRENT_TIMESTAMP WHERE srv_id = (SELECT srv_id FROM srv WHERE srv_name=? and user_id=?)";
                params = [srv_name, user_id];
                DB(sql, params).then(function (result) {
                  if (!result.state) {
                    console.log(result.err);
                    resultMSG(res, -1, "오류가 발생하였습니다.");
                  } else {
                    resultMSG(res, -1, "서버 생성에 실패하였습니다.");
                  }
                });
              } else {
                resultMSG(res, 1, "서버가 생성되었습니다.");
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
