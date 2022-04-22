require("dotenv").config();

const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');

const DB = require('./models/config');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
    host: process.env.DB_HOST,    
    port: process.env.DB_PORT,
    user: process.env.DB_USER,          
    password: process.env.DB_PASS,      
    database: process.env.DB_NAME       
};
const sessionStore = new MySQLStore(options);

const app = express();
const PORT = process.env.PORT;

// routers
const auth = require('./routes/auth');

// cors 
app.use(cors());

// view
// app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", __dirname + "/views");

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// dircetory
app.use("/public", express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, 'react/build')));

// session
app.use(session({
    secret: "asdfasffdas",
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}))

app.get("/", (req, res) => res.render("home"));

// auth
app.use('/auth', auth);



// get
app.get("/server", (req, res) => res.render("server")); // 서버 생성, 초대
app.get("/notice/add", (req, res) => res.render("notice_add"));  // 공지 추가
app.get("/notice/list", (req, res) => res.render("notice_list"));  // 공지 목록 
app.get("/notice/detail", (req, res) => res.render("notice_detail"));  // 공지 상세

// post


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
            console.log(result.err);
            res.send({ "result": "fail" });

        } else {

            // 관리자를 서버 회원 목록에 추가
            sql = 'INSERT INTO srvuser (srv_id, user_id) VALUES('
                + ' (SELECT srv_id FROM srv WHERE srv_name=? and user_id=?), ?)';
            params = [srv_name, user_id, user_id];
            DB(sql, params).then(function (result) {

                if (!result.state) {
                    console.log(result.err);

                    // 롤백 해야함

                    res.send({ "result": "fail" });

                } else {
                    res.send({ "result": "ok" });
                }
            })

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
            console.log(result.err);
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

// 서버 메뉴
app.post("/server/menu", (req, res) => {

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
            console.log(result.err);
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
    const server = req.body.params;
    const srv_id = server.srv_id;

    console.log(server);

    // check if the user is the administrator of the server
    let sql = 'SELECT notice_id, notice_name, notice_write '
        + 'FROM notice n '
        + 'WHERE srv_id=? AND notice_YN=\'N\'';
    let params = [srv_id];
    DB(sql, params).then(function (result) {

        if (!result.state) {
            console.log(result.err);
            res.send({ "result": "fail" });

        } else {
            console.log(result.rows)
            res.send({ "result": "ok", "list": result.rows })
        }
    })
})

// 공지 상세
app.post("/server/notice/detail", (req, res) => {
    const server = req.body.params;
    const notice_id = server.notice_id;

    console.log(server);

    // check if the user is the administrator of the server
    let sql = 'SELECT notice_name, ('
        + 'SELECT user_name FROM user u WHERE u.user_id=n.user_id) AS user_name, '
        + 'notice_write, notice_memo '
        + 'FROM notice n '
        + 'WHERE notice_id=?';
    let params = [notice_id];

    DB(sql, params).then(function (result) {

        if (!result.state) {
            console.log(result.err);
            res.send({ "result": "fail" });

        } else {
            // console.log(result.rows)
            res.send({ "result": "ok", "list": result.rows })
        }
    })
})


// express server listen
const handleListen = () =>
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);