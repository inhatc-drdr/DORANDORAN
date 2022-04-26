// ***********************************************************
// SERVER API (ADMIN)
// ***********************************************************
// @description : 서버 내 회원 관련 기능
//  - 회원 관리, 추가
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 
// @todo
//  - 
// ***********************************************************

const router = require('express').Router();
const DB = require('../models/config');

// test
router.get('/test', (req, res) => res.render("member"))

// 회원 관리
router.get('/', (req, res) => {

    const user_id = req.user;

    if (!user_id) {
        res.send({
            "result": 0,
            "msg": "로그인 되어있지않습니다.",
        });

    } else {

        if (!req.session.admin) {
            res.send({
                "result": -1,
                "msg": "접근 권한이 없습니다.",
            });

        } else {

            // 회원목록 표시
            // - 아이디, 이름, 이메일, 연락처, 최근접속일

            const srv_id = req.session.sid;

            let sql = 'SELECT su.user_id, user_name, user_email, user_tel, srvuser_lastaccess '
                + 'FROM srvuser su, user u '
                + 'WHERE srv_id=? and su.user_id = u.user_id and srvuser_YN = \'N\' and user_YN  = \'N\'';
            let params = [srv_id];
            DB(sql, params).then(function (result) {

                if (!result.state) {
                    console.log(result.err);
                    res.send({
                        "result": -1,
                    });

                } else {

                    res.send({
                        "result": 1,
                        "list": result.rows,
                    });
                }
            })
        }
    }
})

// 회원 삭제
router.post('/del', (req, res) => {

    const user_id = req.user;

    if (!user_id) {
        res.send({
            "result": 0,
            "msg": "로그인 되어있지않습니다.",
        });

    } else {

        if (!req.session.admin) {
            res.send({
                "result": -1,
                "msg": "접근 권한이 없습니다.",
            });

        } else {

            const del_user_id = req.body.user_id;
            const srv_id = req.session.sid;

            // 관리자 자신은 삭제 불가능
            if (del_user_id == user_id) {
                res.send({
                    "result": -1,
                    "msg": "관리자입니다.",
                });
            } else {

                // 삭제하고자하는 멤버가 서버의 멤버인지 확인
                let sql = 'SELECT srvuser_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN=\'N\'';
                let params = [srv_id, del_user_id];
                DB(sql, params).then(function (result) {

                    if (!result.state) {
                        console.log(result.err);
                        res.send({
                            "result": -1,
                        });

                    } else {

                        if (!result.rows[0]) {
                            res.send({
                                "result": -1,
                            });

                        } else {

                            const srvuser_id = result.rows[0].srvuser_id;

                            // 멤버 삭제
                            sql = 'UPDATE srvuser SET srvuser_YN=\'Y\', srvuser_leave=CURRENT_TIMESTAMP where srvuser_id=?';
                            params = [srvuser_id];

                            DB(sql, params).then(function (result) {

                                if (!result.state) {
                                    console.log(result.err);
                                    res.send({
                                        "result": -1,
                                    });

                                } else {
                                    res.send({
                                        "result": 1,
                                        "msg": "멤버가 삭제되었습니다.",
                                    });
                                }
                            })
                        }
                    }
                })
            }
        }
    }
})


// 회원 초대
router.post('/invent', (req, res) => {

})



module.exports = router;