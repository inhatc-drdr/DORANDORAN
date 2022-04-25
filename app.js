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
    secret: process.env.SCRET_KEY,
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

// auth
app.use('/auth', auth);

// express server listen
const handleListen = () =>
    console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);