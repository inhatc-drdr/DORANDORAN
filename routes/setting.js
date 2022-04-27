// ***********************************************************
// SETTING API
// ***********************************************************
// @description : 설정 화면
//  - 프로필 설정
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 이름 변경
//  - 상태메시지 변경
// @todo
//  - 
// ***********************************************************

const router = require('express').Router();
const DB = require('../models/config');

// test
router.get('/set', (req, res) => res.render("setting"))

router.get('/', (req, res) => {
    const user_id = req.user;

    // if(!user_id) {
    //     res.send({ 
    //         "result": 0,
    //         "msg": "로그인 되어있지않습니다.",
    //     });

    // } else {

        let sql = 'SELECT user_name, user_msg FROM user WHERE user_id=(?) and user_YN  = \'N\''
        let params = [user_id];
        DB(sql, params).then(function (result) {

            // return 
            if (!result.state) {
                console.log(result.err);
                res.send({
                    "result": -1,
                })

            } else {

                res.send({
                    "result": 1,
                    "name": result.rows[0].user_name,
                    "msg": result.rows[0].user_msg,
                })
            }
        })
    // }
})

router.post('/name', (req, res) => {
    const user_id = req.user;

    // if(!user_id) {
    //     res.send({ 
    //         "result": 0,
    //         "msg": "로그인 되어있지않습니다.",
    //     });

    // } else {
        const account = req.body;
        const name = account.name;

        // console.log(user_id, name)
        let sql = 'UPDATE user SET user_name=? WHERE user_id=?'
        let params = [name, user_id];
        DB(sql, params).then(function (result) {

            // return 
            if (!result.state) {
                console.log(result.err);
                res.send({
                    "result": -1,
                    "msg": "이름이 변경되지않았습니다.",
                })

            } else {
                res.send({
                    "result": 1,
                    "msg": "이름이 변경되었습니다.",
                })
            }
        })

    // }
    
})

router.post('/msg', (req, res) => {
    const user_id = req.user;

    // if(!user_id) {
    //     res.send({ 
    //         "result": 0,
    //         "msg": "로그인 되어있지않습니다.",
    //     });

    // } else {
        const account = req.body;
        const msg = account.msg;

        let sql = 'UPDATE user SET user_msg=? WHERE user_id=?'
        let params = [msg, user_id];
        DB(sql, params).then(function (result) {

            // return 
            if (!result.state) {
                console.log(result.err);
                res.send({
                    "result": -1,
                    "msg": "상태메시지가 변경되지않았습니다.",
                })

            } else {
                res.send({
                    "result": 1,
                    "msg": "상태메시지가 변경되었습니다.",
                })
            }
        })

    // }
    
})

module.exports = router;