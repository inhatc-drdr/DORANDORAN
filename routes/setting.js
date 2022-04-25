// ***********************************************************
// SETTING API
// ***********************************************************
// @description : 설정 화면
//  - 프로필 설정
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 프로필 표시
// @todo
//  - 이름 변경
//  - 상태메시지 변경
// ***********************************************************

const router = require('express').Router();
const DB = require('../models/config');

router.get('/', (req, res) => {
    const user_id = req.user;

    if(!user_id) {
        res.send({
            "result": -1,
        })

    } else {

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
    }
})


router.post('/name', (req, res) => {
    const user_id = req.user;

    if(!user_id) {

    } else {
        const account = req.body;
        const name = account.name;

        console.log(user_id, name)
    }
    
    res.send('a')
})

module.exports = router;