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

const router = require('express').Router();
const DB = require('../models/config');

//test
router.get('/test', (req, res) => {
    res.send(req.session.sid)
})

// 서버 접속
// 멤버 여부 확인 -> 접속 시간 저장 -> 세션 저장
router.get('/', (req, res) => {
    const user_id = req.user;

    // if (!user_id) {
    //     res.send({
    //         "result": 0,
    //         "msg": "로그인 되어있지않습니다.",
    //     });

    // } else {

        const server = req.query;
        const srv_id = server.srv_id;

        // 서버의 멤버인지 확인
        let sql = 'SELECT srvuser_id, s.user_id as admin_id FROM srvuser su, srv s WHERE su.srv_id=? AND su.user_id=? AND su.srv_id = s.srv_id AND srvuser_YN=\'N\'';
        let params = [srv_id, user_id];
        DB(sql, params).then(function (result) {

            if (!result.state) {
                console.log(result.err);
                res.send({
                    result: -1,
                    msg: "서버에 접속할 수 없습니다."
                });

            } else {

                if (!result.rows[0]) {
                    res.send({
                        result: -1,
                        msg: "서버에 접속할 수 없습니다."
                    });

                } else {
                    const srvuser_id = result.rows[0].srvuser_id;
                    const admin_id = result.rows[0].admin_id;

                    // 접속 시간 저장
                    sql = 'UPDATE srvuser SET srvuser_lastaccess=CURRENT_TIMESTAMP WHERE srvuser_id=?';
                    params = [srvuser_id];
                    DB(sql, params).then(function (result) {

                        if (!result.state) {
                            console.log(result.err);
                            res.send({
                                result: -1,
                                msg: "서버에 접속할 수 없습니다."
                            });

                        } else {

                            // 접속한 서버 정보 세션 저장
                            req.session.sid = srv_id;

                            // 관리자여부 세션 저장
                            if(admin_id == user_id){
                                req.session.admin = 1;
                            } else {
                                req.session.admin = 0;
                            }

                            req.session.save(err => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send("<h1>500 error</h1>");
                                }

                                res.send({
                                    "result": 1,
                                })
                            })

                        }
                    })
                }
            }
        })
    // }
})


module.exports = router;