// ***********************************************************
// SERVER API
// ***********************************************************
// @description : 서버 관련 라우터
//  - 서버 생성, 공지, 일정, ... 
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 서버 추가
// @todo
//  - 
// ***********************************************************

const router = require('express').Router();
const DB = require('../models/config');

//test
router.get('/add', (req, res) => res.render('server'))

router.post('/add', (req, res) => {

    const user_id = req.user;

    if (!user_id) {
        res.send({ 
            "result": 0,
            "msg": "로그인 되어있지않습니다.",
        });

    } else {
        const server = req.body;
        const srv_name = server.srv_name;

        // 서버 추가
        let sql = 'INSERT INTO srv (srv_name, user_id) VALUES(?,?)';
        let params = [srv_name, user_id];
        DB(sql, params).then(function (result) {

            if (!result.state) {
                console.log(result.err);
                res.send({ 
                    "result": -1,
                });

            } else {

                // 관리자를 서버 회원 목록에 추가
                sql = 'INSERT INTO srvuser (srv_id, user_id) VALUES('
                    + ' (SELECT srv_id FROM srv WHERE srv_name=? and user_id=?), ?)';
                params = [srv_name, user_id, user_id];
                DB(sql, params).then(function (result) {

                    if (!result.state) {
                        console.log(result.err);

                        // 실패시 추가된 서버도 삭제
                        sql = 'UPDATE srv SET srv_YN=\'Y\', srv_delete=CURRENT_TIMESTAMP WHERE srv_id = (SELECT srv_id FROM srv WHERE srv_name=? and user_id=?)';
                        params = [srv_name, user_id];
                        DB(sql, params).then(function (result) {

                            if (!result.state) {
                                console.log(result.err);
                                res.send({ 
                                    "result": -1,
                                });

                            } else {
                                res.send({ 
                                    "result": -1,
                                });
                            }
                        })

                    } else {
                        res.send({ 
                            "result": 1,
                            "msg": "서버가 생성되었습니다."
                         });
                    }
                })

            }
        })
    }
})



module.exports = router;