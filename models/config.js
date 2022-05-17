require("dotenv").config();

const mysql = require('mysql2/promise');
const info = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dateStrings: 'date',
};

const pool = mysql.createPool(info);

const DB = async (sql, params) => {
    try {
        let result = {};
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(sql, params);
            result.rows = rows;
            result.state = true;
            connection.release();
            return result;
        } catch (err) {
            console.log('Query Error');
            result.state = false;
            result.error = err;
            connection.release();
            return result;
        }
    } catch (err) {
        console.log('DB Error');
        result.state = false;
        result.error = err;
        return result;
    }
}

// module.exports = DB;
export { pool }