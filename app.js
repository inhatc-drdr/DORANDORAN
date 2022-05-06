require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// routers
const { authenticateAccessToken } = require("./routes/jwt");
const auth = require("./routes/auth");
const home = require("./routes/home");
const setting = require("./routes/setting");
const server = require("./routes/server");
const member = require("./routes/member");
const calendar = require("./routes/calendar");
const notice = require("./routes/notice");

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
app.use("/home", authenticateAccessToken, home);
app.use("/setting", authenticateAccessToken, setting);
app.use("/server", authenticateAccessToken, server);
app.use("/server/calendar", authenticateAccessToken, calendar);
app.use("/server/notice", authenticateAccessToken, notice);
app.use("/server/member", authenticateAccessToken, member);

// express server listen
const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);
