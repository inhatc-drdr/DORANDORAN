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
const DB = require("../models/config");
const { resultMSG, resultList } = require("./send");
const { authenticateAccessToken } = require("./jwt");


router.get('/getname', authenticateAccessToken, (req, res) => {

    const user_id = req.user.id;

    console.log(`[${new Date().toLocaleString()}] [uid ${user_id} /video/getname] `);

    let sql =
        "SELECT user_name FROM user WHERE user_id=(?) and user_YN  = 'N'";
    let params = [user_id];
    DB(sql, params).then(function (result) {
        // return
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
        } else {

            if (!result.rows.length) {
                return resultMSG(res, -1, "불러올 수 없습니다.");
            }

            resultList(res, 1, null, result.rows);
        }
    });

});

// no room name specified to join
// router.get('/', (req, res) => {

//     if (Object.keys(req.query).length > 0) {
//         log.debug('Request Query', req.query);
//         /* 
//             http://localhost:3000/join?room=test&name=mirotalk&audio=1&video=1&notify=1
//             https://mirotalk.up.railway.app/join?room=test&name=mirotalk&audio=1&video=1&notify=1
//             https://mirotalk.herokuapp.com/join?room=test&name=mirotalk&audio=1&video=1&notify=1
//         */
//         let roomName = req.query.room;
//         let peerName = req.query.name;
//         let peerAudio = req.query.audio;
//         let peerVideo = req.query.video;
//         let notify = req.query.notify;
//         // all the params are mandatory for the direct room join
//         if (roomName && peerName && peerAudio && peerVideo && notify) {
//             res.setHeader('Access-Control-Allow-origin', '*');
//             return res.render("client");
//         }
//     }

//     res.setHeader('Access-Control-Allow-origin', '*');
//     // res.send('404');
//     return res.render("client");

// });

// Join Room *
// router.get('/*', (req, res) => {

//     res.setHeader('Access-Control-Allow-origin', '*');
//     res.render("client");
// });

module.exports = router;