const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const PORT = 5000;

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
    if(user_email == "test@test.com" && user_pwd == "1234"){
        res.send({"result": "ok"});
    } else {
        res.send({"result": "fail"});
    }
})

app.post("/join", (req, res) => {
    const account = req.body.params;
    const user_name = account.user_name;
    const user_email = account.user_email;
    const user_pwd = account.user_pwd;
    const user_tel = account.user_tel;
    const agree = account.agree;

    // save db
    if(user_name == "test"){
        res.send({"result": "ok"});
    } else {
        res.send({"result": "fail"});
    }
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


// express server listen
const handleListen = () => 
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);