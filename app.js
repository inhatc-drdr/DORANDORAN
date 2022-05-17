require("dotenv").config();

const http = require('http');
const https = require('https');
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// routers
const { authenticateAccessToken } = require("./routes/jwt");
const authApi = require("./routes/auth");
const homeApi = require("./routes/home");
const settingApi = require("./routes/setting");
const serverApi = require("./routes/server");
const memberApi = require("./routes/member");
const calendarApi = require("./routes/calendar");
const noticeApi = require("./routes/notice");
const videoApi = require("./routes/video");

const Logger = require('./routes/Logger');
const log = new Logger('server');

const isHttps = false; // must be the same on client.js

let server, host;
export { server };

if (isHttps) {
  const options = {
    key: fs.readFileSync(path.join(__dirname, './ssl/key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, './ssl/cert.pem'), 'utf-8'),
  };
  server = https.createServer(options, app);
  host = 'https://' + 'localhost' + ':' + PORT;
} else {
  server = http.createServer(app);
  host = 'http://' + 'localhost' + ':' + PORT;
}

require('./routes/socket');

// cors
// app.use(cors());
app.use(cors({
  origin: "*",
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

// routers
app.get("/", (req, res) => res.send("hello"));
app.use("/", authApi);
app.use("/home", authenticateAccessToken, homeApi);
app.use("/setting", authenticateAccessToken, settingApi);
app.use("/server", authenticateAccessToken, serverApi);
app.use("/server/calendar", authenticateAccessToken, calendarApi);
app.use("/server/notice", authenticateAccessToken, noticeApi);
app.use("/server/member", authenticateAccessToken, memberApi);
app.use("/video", videoApi);

const handleListen =
  () => console.log(`Listening on ${host}`);

server.listen(PORT, null, handleListen);
