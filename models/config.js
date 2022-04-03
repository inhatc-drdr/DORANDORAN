require("dotenv").config();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,    // 호스트 주소
    user: process.env.DB_USER,           // mysql user
    password: process.env.DB_PASS,       // mysql password
    database: process.env.DB_NAME         // mysql 데이터베이스
});
connection.connect();

module.exports = connection;