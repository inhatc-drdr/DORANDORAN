require("dotenv").config();

const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');

const DB = require('./models/config');
const { hashCreate, hashCheck } = require('./routes/crypto');

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
    secret: process.env.SCRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}))

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    done(null, id)
})

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        }, function (username, password, done) {

            // login check
            let sql = 'SELECT count(*) as count, user_id, user_pwd, user_salt FROM user WHERE user_email=? AND user_YN=\'N\'';
            let params = [username];
            let login_result = 0;
            let login_id;
            DB(sql, params).then((result) => {

                if (!result.state) {
                    console.log(result.err);

                } else {
                    let count = result.rows[0].count;
                    if (!count) {

                    } else {
                        const user_pwd = result.rows[0].user_pwd;
                        const user_salt = result.rows[0].user_salt;

                        console.log(user_pwd, user_salt)

                        // 복호화
                        const crypto_pwd = hashCheck(user_salt, password);

                        if (user_pwd == crypto_pwd) {

                            login_result = 1;
                            login_id = result.rows[0].user_id;

                            console.log(login_id)

                        } else {

                        }
                    }
                }

                if (!login_result) {
                    return done(null, false, { message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
                } else {
                    return done(null, {id: login_id});
                }
            })
           
        }
    )
)

// app.get("/", (req, res) => res.render("home"));

// auth
// app.use('/auth', auth);


//login
app.get('/login', (req, res) => {
    let msg = req.flash().error;
    if(msg){
        res.render("login", {msg: msg[0]})
    } else {
        res.render("login", {msg: ""})
    }
    
})

app.get('/', (req, res) => {
    res.render("main")
})


app.post("/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
)

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});


// express server listen
const handleListen = () =>
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);