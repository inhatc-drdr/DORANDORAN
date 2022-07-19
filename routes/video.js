// ***********************************************************
// VIDEO API
// ***********************************************************
// @description : 화상강의
// @date : 2022-05-15
// @did
//  - 
// @todo
//  - 
// ***********************************************************

const router = require("express").Router();
const { pool } = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { authenticateAccessToken } = require("./jwt");


router.get('/getname', authenticateAccessToken, async (req, res) => {

    const user_id = req.user.id;

    console.log(`[${new Date().toLocaleString()}] [uid ${user_id} GET /video/getname] `)

    const conn = await pool.getConnection();
    try {
        // await conn.beginTransaction() // 트랜잭션 적용 시작

        const sel = await conn.query(
            "SELECT user_name FROM user WHERE user_id=(?) and user_YN  = 'N'"
            , [user_id])

        if (!sel[0][0]) {
            throw new Error("존재하지 않은 정보");
        }

        // await conn.commit() // 커밋

        console.log(sel[0])
        return resultList(res, 1, null, sel[0]);

    } catch (err) {
        console.log(err)
        // await conn.rollback() // 롤백
        // return res.status(500).json(err)
        resultMSG(res, -1, "오류가 발생하였습니다.");

    } finally {
        conn.release() // conn 회수
    }

});

module.exports = router;