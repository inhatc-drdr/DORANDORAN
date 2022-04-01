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
    const email = account.email;
    const password = account.password;

    // login check
    if(email == "test@test.com" && password == "1234"){
        res.send({"result": "ok"});
    } else {
        res.send({"result": "fail"});
    }
})

app.post("/join", (req, res) => {
    const account = req.body.params;
    const name = account.name;
    const email = account.email;
    const password = account.password;
    const tel = account.tel;
    const agree = account.agree;

    // Join
    if(name == "test"){
        res.send({"result": "ok"});
    } else {
        res.send({"result": "fail"});
    }
})

app.post("/account/password", (req, res) => {
    const account = req.body.params;
    const name = account.name;
    const email = account.email;

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
    const id = req.body.params.id;

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


// express server listen
const handleListen = () => 
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);