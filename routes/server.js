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
const DB = require("../models/config");
const { resultMSG, errorMSG } = require("../app");

// 서버 접속
// 멤버 여부 확인 -> 접속 시간 저장 -> 세션 저장
router.get("/", (req, res) => {
  const user_id = req.user;
  const srv_id = req.query.srv_id;

  console.log(
    `[${new Date().toLocaleString()}] [uid ${user_id} /server] srv_id=${srv_id}`
  );

  // 서버의 멤버인지 확인
  let sql =
    "SELECT srvuser_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN='N'";
  let params = [srv_id, user_id];
  DB(sql, params).then(function (result) {
    if (!result.state) {
      console.log(result.err);
      //   resultMSG(res, -1, "서버에 접속할 수 없습니다.");
      errorMSG(res, 500);
    } else {
      if (!result.rows[0]) {
        resultMSG(res, -1, "서버에 접속할 수 없습니다.");
      } else {
        const srvuser_id = result.rows[0].srvuser_id;
        // const admin_id = result.rows[0].admin_id;

        // 접속 시간 저장
        sql =
          "UPDATE srvuser SET srvuser_lastaccess=CURRENT_TIMESTAMP WHERE srvuser_id=?";
        params = [srvuser_id];
        DB(sql, params).then(function (result) {
          if (!result.state) {
            console.log(result.err);
            // resultMSG(res, -1, "서버에 접속할 수 없습니다.");
            errorMSG(res, 500);
          } else {
            // 접속한 서버 정보 세션 저장
            // req.session.sid = srv_id;

            // // 관리자여부 세션 저장
            // if (admin_id == user_id) {
            //   req.session.admin = 1;
            // } else {
            //   req.session.admin = 0;
            // }

            // req.session.save((err) => {
            //   if (err) {
            //     console.log(err);
            //     // return res.status(500).send("<h1>500 error</h1>");
            //     errorMSG(res, 500);
            //   }

            resultMSG(res, 1, "서버에 접속되었습니다.");
            // });
          }
        });
      }
    }
  });
});

// 서버 생성
router.post("/add", (req, res) => {
  const user_id = req.user;
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
      //   resultMSG(res, -1, "서버 생성에 실패하였습니다.");
      errorMSG(res, 500);
    } else {
      if (result.rows[0].count) {
        resultMSG(res, -1, "이미 존재하는 서버입니다.");
      } else {
        // 서버 추가
        sql = "INSERT INTO srv (srv_name, user_id) VALUES(?,?)";
        DB(sql, params).then(function (result) {
          if (!result.state) {
            console.log(result.err);
            // resultMSG(res, -1, "서버 생성에 실패하였습니다.");
            errorMSG(res, 500);
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
                    // resultMSG(res, -1, "서버 생성에 실패하였습니다.");
                    errorMSG(res, 500);
                  } else {
                    resultMSG(res, -1, "서버 생성에 실패하였습니다.");
                  }
                });
              } else {
                resultMSG(res, -1, "서버가 생성되었습니다.");
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
