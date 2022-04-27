require("dotenv").config();

const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');

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
const home = require('./routes/home');
const setting = require('./routes/setting');
const server = require('./routes/server');
const server_admin = require('./routes/server-admin');

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

// session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}))

const passport = require('passport');
const flash = require('connect-flash');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport_local')(passport);

app.get("/", (req, res) => res.send("hello"));

function loginRequired(req, res, next) {
    // 미 로그인
    if (!req.user) {
        // res.redirect('/auth/login');

        res.send({
            result: 0,
            msg: "로그인 되어있지않습니다.",
        })
        return;
    }
    next();
}

function adminRequired(req, res, next) {
    // 미 로그인
    if (!req.user) {
        // res.redirect('/auth/login');

        res.send({
            result: 0,
            msg: "로그인 되어있지않습니다.",
        })
        return;
    }

    // 서버 미선택
    if (!req.session.sid) {
        // res.redirect('/home');

        res.send({
            result: -1,
            msg: "선택된 서버가 없습니다.",
        })
        return;
    }

    // 관리자 아님
    if (!req.session.admin) {
        // res.redirect('/home');

        res.send({
            result: -1,
            msg: "접근 권한이 없습니다.",
        })
        return;
    }

    next();
}

// routers
app.use('/auth', auth);
// app.use('/home', home);
// app.use('/setting', setting);
// app.use('/server', server);
// app.use('/server', server_admin);

app.use('/home', loginRequired, home);
app.use('/setting', loginRequired, setting);
app.use('/server', loginRequired, server);
app.use('/server', adminRequired, server_admin);

// express server listen
const handleListen = () =>
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);