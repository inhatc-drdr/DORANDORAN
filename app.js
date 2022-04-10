require("dotenv").config();

const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');

const DB = require('./models/config')

const app = express();
const PORT = process.env.PORT;

// cors 
app.use(cors());

// view
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// dircetory
app.use("/public", express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, 'react/build')));

// get
app.get("/", (req, res) => res.render("home"));

// post
// 로그인
app.post("/login", (req, res) => {
    const account = req.body.params;
    const user_email = account.user_email;
    const user_pwd = account.user_pwd;

    // login check
    let sql = 'SELECT count(*) AS count FROM user WHERE user_email=? and user_pwd=?';
    let params = [user_email, user_pwd];
    DB(sql, params).then((result) => {

        // return 
        if (!result.state) {
            console.log(result.err);
            res.send({ "result": "fail" });
        } else {
            let count = result.rows[0].count;
            if (!count) {
                res.send({ "result": "fail" });
            } else {
                res.send({ "result": "ok" });
            }
        }
    })
})

// 회원가입
app.post("/join", (req, res) => {
    const account = req.body.params;
    const user_name = account.user_name;
    const user_email = account.user_email;
    const user_pwd = account.user_pwd;
    const user_tel = account.user_tel;

    // insert db
    console.log(account)

    let sql = 'INSERT INTO user (user_name, user_email, user_pwd, user_tel) VALUES(?,?,?,?)';
    let params = [user_name, user_email, user_pwd, user_tel];
    DB(sql, params).then(function (result) {

        // return 
        if (!result.state) {
            res.send({ "result": "fail" });
        } else {
            res.send({ "result": "ok" });
        }
    })

})

// 회원가입 - 이메일 중복 확인
app.post("/join/email", (req, res) => {

})

// 서버 생성
app.post("/server/create", (req, res) => {
    const server = req.body.params;
    const srv_name = server.srv_name;
    const user_id = server.user_id;

    // insert db
    console.log(server)

    let sql = 'INSERT INTO srv (srv_name, user_id) VALUES(?,?)';
    let params = [srv_name, user_id];
    DB(sql, params).then(function (result) {

        // return 
        if (!result.state) {
            res.send({ "result": "fail" });
        } else {
            res.send({ "result": "ok" });
        }
    })
})

// 회원 초대
app.post("/server/invent", (req, res) => {
    const server = req.body.params;
    const srv_id = server.srv_id;
    const user_email = server.user_email;

    console.log(server)

    // Check if you are already a member
    let sql = 'SELECT count(*) as count FROM srvuser WHERE srv_id=? ' +
        'AND user_id=(SELECT user_id FROM user WHERE user_email=?)';
    let params = [srv_id, user_email];
    DB(sql, params).then(function (result) {

        if (!result.state) {
            res.send({ "result": "fail" });
        } else {
            let count = result.rows[0].count;
            if (count) {
                res.send({ "result": "fail" });
            } else {

                // insert db
                sql = 'INSERT INTO srvuser (srv_id, user_id) ' +
                    'VALUES(?, (SELECT user_id FROM user WHERE user_email=?))';
                DB(sql, params).then(function (result) {

                    // return 
                    if (!result.state) {
                        res.send({ "result": "fail" });
                    } else {
                        res.send({ "result": "ok" });
                    }
                })
            }
        }
    })
})

// 공지 추가
app.post("/server/notice/add", (req, res) => {
    const server = req.body.params;
    const srv_id = server.srv_id;
    const user_id = server.user_id;
    const notice_name = server.notice_name;
    const notice_memo = server.notice_memo;

    console.log(server);

    // check if the user is the administrator of the server
    let sql = 'SELECT user_id FROM srv WHERE srv_id=?';
    let params = [srv_id];
    DB(sql, params).then(function (result) {

        if (!result.state) {
            res.send({ "result": "fail" });

        } else {
            if (!result.rows[0]) {
                res.send({ "result": "fail" });

            } else {
                let admin_id = result.rows[0].user_id;

                if (user_id == admin_id) {

                    // insert db
                    sql = 'INSERT INTO notice (srv_id, user_id, notice_name, notice_memo)'
                        + ' VALUES(?,?,?,?)';
                    params = [srv_id, user_id, notice_name, notice_memo];
                    DB(sql, params).then(function (result) {
                        // return 
                        if (!result.state) {
                            res.send({ "result": "fail" });
                        } else {
                            res.send({ "result": "ok" });
                        }
                    })
                } else {
                    res.send({ "result": "fail" });
                }
            }
        }
    })
})

// 공지 목록
app.post("/server/notice/list", (req, res) => {

})

// 공지 내용
app.post("/server/notice/detail", (req, res) => {

})


// express server listen
const handleListen = () =>
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);