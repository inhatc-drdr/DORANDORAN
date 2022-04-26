// ***********************************************************
// HOME API
// ***********************************************************
// @description : 홈 화면
//  - 서버 목록
// @date : 2022-04-26
// @modifier : 노예원
// @did
//  - 서버 목록
// @todo
//  - 
// ***********************************************************

const router = require('express').Router();
const DB = require('../models/config');

router.get('/', (req, res) => {

    const user_id = req.user;


    if(!user_id){
        // res.send()
        // failed
        res.send({
            "result": -1,
        })

    } else {
        
        // 서버 목록 검색
        // - 서버명, 다음 미팅 날짜
        // - 최근 접속 순

        let sql = 'SELECT s.srv_id, s.srv_name, '
            // + '(SELECT calendar_id FROM calendar c WHERE c.srv_id=s.srv_id and calendar_YN = \'N\' and calendar_date >= now() order by calendar_date asc limit 1) as calendar_id, ' 
            + '(SELECT calendar_date FROM calendar c WHERE c.srv_id=s.srv_id and calendar_YN = \'N\' and calendar_date >= now() order by calendar_date asc limit 1) as calendar_date '
            + 'FROM srvuser su, srv s '
            + 'WHERE su.user_id=(?) and su.srv_id = s.srv_id and su.srvuser_YN = \'N\' '
            + 'order by srvuser_lastaccess desc';

        let params = [user_id];
        DB(sql, params).then(function (result) {

            // return 
            if (!result.state) {
                console.log(result.err);
                res.send({
                    "result": -1,
                })

            } else {
                
                console.log(result.rows)
                console.log(result.rows.length)

                res.send({
                    "result": 1,
                    "list": result.rows,
                })
            }
        })

    }

})

module.exports = router;