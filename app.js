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
app.post("/login", (req, res) => {
    const account = req.body.params;
    const user_email = account.user_email;
    const user_pwd = account.user_pwd;

    // login check
    let sql = 'SELECT count(*) AS count FROM user WHERE user_email=? and user_pwd=?';
    let params = [user_email, user_pwd];
    DB(sql, params).then((result) => {

        // return 
        if(!result.state){
            console.log(result.err);
            res.send({"result": "fail"});
        } else {
            let count = result.rows[0].count;
            if(!count){
                res.send({"result": "fail"});
            } else {
                res.send({"result": "ok"});
            }
        }
    })
})

app.post("/join", (req, res) => {
    const account = req.body.params;
    const user_name = account.user_name;
    const user_email = account.user_email;
    const user_pwd = account.user_pwd;
    const user_tel = account.user_tel;

    // save db
    console.log(account) 

    let sql = 'INSERT INTO user (user_name, user_email, user_pwd, user_tel) VALUES(?,?,?,?)';
    let params = [user_name, user_email, user_pwd, user_tel];
    DB(sql, params).then(function(result) {

        // return 
        if(!result.state){
            res.send({"result": "fail"});
        } else {
            res.send({"result": "ok"});
        }
    })

})

app.post("/account/password", (req, res) => {
    const account = req.body.params;
    const user_name = account.user_name;
    const user_email = account.user_email;

    // account check

    // create temporary password
    let new_password;
    new_password = "1111";

    // send email
    let sendEmail = false;

    // return 
    if(new_password != null && sendEmail){
        res.send({"result": "ok"});
    } else {
        res.send({"result": "fail"});
    }
})

app.post("/home", (req, res) => {
    const user_id = req.body.params.user_id;

    // search server list
    // return srv_id, srv_name, (next)calendar_date, (next)calendar_time, memberList_attendRate
    let srv_id;
    let srv_name;
    let next_meeting;
    let attend_rate;

    if(TRUE){
        res.send({
            "result":"ok",
            "srv_id": srv_id,
            "srv_name": srv_name,
            "next_meeting": next_meeting,
            "attend_rate": attend_rate
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }
})

app.post("/my/account", (req, res) => {
    const user_id = req.body.params.user_id;

    // search 
    // return user_name, imgs_path, user_msg
    let user_name;
    let imgs_path;
    let user_msg;

    if(TRUE){
        res.send({
            "result":"ok",
            "user_name": user_name,
            "imgs_path": imgs_path,
            "user_msg": user_msg
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }

})

app.post("/my/imgs", (req, res) => {
    const profile = req.body.params;
    const user_id = profile.user_id;
    const imgs_name = profile.imgs_name;
    const imgs_path = profile.imgs_path;

    // save db
    if(TRUE){
        res.send({
            "result":"ok"
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }
})

app.post("/my/name", (req, res) => {
    const profile = req.body.params;
    const user_id = profile.user_id;
    const new_name = profile.new_name;

    // save db
    if(TRUE){
        res.send({
            "result":"ok"
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }
})

app.post("/my/msg", (req, res) => {
    const profile = req.body.params;
    const user_id = profile.user_id;
    const new_msg = profile.new_msg;

    // save db
    if(TRUE){
        res.send({
            "result":"ok"
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }
})

app.post("/my/password", (req, res) => {
    const profile = req.body.params;
    const user_id = profile.user_id;
    const user_pwd = profile.user_pwd;
    const new_pwd = profile.new_pwd;

    // check now password is correct

    // save db
    if(TRUE){
        res.send({
            "result":"ok"
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }
})

app.post("/my/signout", (req, res) => {
    const profile = req.body.params;
    const user_id = profile.user_id;
    const user_pwd = profile.user_pwd;

    // check password is correct

    // delete account
    if(TRUE){
        res.send({
            "result":"ok"
        })
    } else {
        res.send({
            "result": "fail" 
        })
    }
})

app.post("/server/info", (req, res) => {
    const server = req.body.params;
    const user_id = server.user_id;
    const srv_id = server.srv_id;

    // select server information
    // user is server host?
    let is_host;
    // chat list : chat_id, chat_name
    let chats;
    // member list : user_id, user_name, imgs_path
    let members;

    if(TRUE){
        res.send({
            "result": "ok",
            "is_host": is_host,
            "chats": chats,
            "members": members
        })
    } else {
        res.send({
            "result": "fail"
        })
    }
})

app.post("/server/notice", (req, res) => {
    const server = req.body.params;
    const srv_id = server.srv_id;

    // search
    let notice_id;
    let notice_name;
    let notice_memo;
    // write user name
    let writer;
    let notice_writeDate;

    if(TRUE){
        res.send({
            "result": "ok",
            "notice_id": notice_id,
            "notice_name": notice_name,
            "notice_memo": notice_memo,
            "writer": writer,
            "notice_writeDate": notice_writeDate
        })
    } else {
        res.send({
            "result": "fail"
        })
    }
})

app.post("/server/calendar", (req, res) => {
    const server = req.body.params;
    const srv_id = server.srv_id;

    // search
    let calendar_id;
    let calendar_date;
    let calendar_time;
    let calendar_nowVal;
    let calendar_name; 
    let calendar_memo;
    // write user name
    let writer;
    let calendar_writeDate;

    if(TRUE){
        res.send({
            "result": "ok",
            "calendar_id": calendar_id,
            "calendar_date": calendar_date,
            "calendar_time": calendar_time,
            "calendar_nowVal": calendar_nowVal,
            "calendar_name": calendar_name,
            "calendar_memo": calendar_memo,
            "writer": writer,
            "calendar_wrtieDate": calendar_writeDate
        })
    } else {
        res.send({
            "result": "fail"
        })
    }
})



// express server listen
const handleListen = () => 
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);