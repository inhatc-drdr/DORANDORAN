require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
const sessionStore = new MySQLStore(options);

const app = express();
const PORT = process.env.PORT || 3000;

// routers
const { loginRequired, srvRequired, adminRequired } = require("./routes/required");
const auth = require("./routes/auth");
const home = require("./routes/home");
const setting = require("./routes/setting");
const server = require("./routes/server");
const member = require("./routes/member");
const calendar = require("./routes/calendar");

// cors
// app.use(cors());
app.use(cors({
  origin: true,
  credentials: true
}));

// view
// app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/views");

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// dircetory
app.use("/public", express.static(__dirname + "/public"));

// session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

const passport = require("passport");
const flash = require("connect-flash");

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./config/passport_local")(passport);

// response 전송
export function resultMSG(res, result, msg) {
  res.send({
    result: result,
    msg: msg,
  });
}

// routers
app.get("/", (req, res) => res.send("hello"));
app.use("/", auth);
app.use("/home", loginRequired, home);
app.use("/setting", loginRequired, setting);
app.use("/server", loginRequired, server);
app.use("/server/calendar", loginRequired, calendar);
// app.use("/server/member", adminRequired, member);
app.use("/server/member", loginRequired, member);

// express server listen
const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);
