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

// 회원 관리
router.get('/', (req, res) => {

    const user_id = req.user;

    if (!user_id) {
        res.send({ 
            "result": 0,
            "msg": "로그인 되어있지않습니다.",
        });

    } else {
        // 회원목록 표시
        // - 아이디, 이름, 이메일, 연락처, 최근접속일

        // const server = req.query;
        // const srv_id = server.srv_id;
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
})

// 회원 삭제
router.post('/del', (req, res) => {

})


// 회원 초대
router.post('/invent', (req, res) => {

})



module.exports = router;