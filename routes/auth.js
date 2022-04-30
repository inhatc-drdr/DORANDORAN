// ***********************************************************
// AUTH API
// ***********************************************************
// @description : 유저 관련 라우터
//  - 로그인, 회원가입, 이메일 중복확인, 로그아웃, 회원탈퇴
// @date : 2022-04-25
// @modifier : 노예원
// @did
//  - passport_local 모듈 작용
//  - response 문구 수정
// @todo
//  - jwt 적용
// ***********************************************************

const router = require('express').Router();
const DB = require('../models/config');
const { hashCreate, hashCheck } = require('../config/crypto');
const { resultMSG } = require('../app');
const passport = require('passport');
require('../config/passport_local')(passport);


// 로그인
router.get('/login', (req, res) => {
    let msg = req.flash().error;
    if (msg) {
        res.render("login", { msg: msg[0] })
    } else {
        res.render("login", { msg: "" })
    }

});

router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "#",
        failureFlash: true,
    })
)

// 로그아웃
router.use('/logout', (req, res) => {

    console.log(`[uid ${req.user} /auth/logout] `);


    if (!req.user) {
        // session이 존재하지 않은 경우, 로그인 하지 않은 경우
        resultMSG(res, -1, "로그인 되어있지 않습니다.");

    } else {

        req.logout();
        resultMSG(res, 1, "로그아웃 되었습니다.");
    }
})

// 회원가입
router.get('/signup', (req, res) => res.render('join'));
router.post('/signup', (req, res) => {
    const account = req.body;
    const name = account.name;
    const email = account.email;
    const pwd = account.pwd;
    const tel = account.tel;

    console.log(`[uid - /auth/signup] name=${name}&email=${email}&pwd=${pwd}&tel=${tel}`);

    // insert db
    console.log(account)

    // 암호화
    const hashed = hashCreate(pwd);

    const salt = hashed.salt;
    const crypto_pwd = hashed.pwd;

    let sql = 'INSERT INTO user (user_name, user_email, user_pwd, user_tel, user_salt) VALUES(?,?,?,?,?)';
    let params = [name, email, crypto_pwd, tel, salt];
    DB(sql, params).then(function (result) {

        // return 
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "회원가입에 실패하였습니다.");

        } else {
            resultMSG(res, 1, "회원가입이 완료되었습니다.");
        }
    })
});

// 이메일 중복확인
router.post('/email', (req, res) => {
    const account = req.body;
    const email = account.email;

    console.log(`[uid - /auth/email] email=${email}`);

    let sql = 'SELECT count(*) as count FROM user WHERE user_email = ?';
    let params = [email];
    DB(sql, params).then(function (result) {

        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "중복확인 실패하였습니다.");

        } else {
            let count = result.rows[0].count;
            if (!count) {
                resultMSG(res, 1, "사용가능한 이메일 입니다.");

            } else {
                resultMSG(res, -1, "중복된 이메일입니다.");
            }
        }
    })
});

// 회원탈퇴
router.post('/signout', (req, res) => {

    console.log(`[uid ${req.user} /auth/signout] `);

    if (!req.user) {
        // session이 존재하지 않은 경우, 로그인 하지 않은 경우
        resultMSG(res, -1, "로그인 되어있지않습니다.");

    } else {
        const id = req.user;
        const pwd = req.body.pwd;

        let sql = 'SELECT count(*) as count, user_pwd, user_salt FROM user WHERE user_id=? AND user_YN=\'N\'';
        let params = [id];
        DB(sql, params).then((result) => {

            // return 
            if (!result.state) {
                console.log(result.err);
                resultMSG(res, -1, "탈퇴에 실패하였습니다.");


            } else {
                let count = result.rows[0].count;
                if (!count) {
                    resultMSG(res, -1, "탈퇴에 실패하였습니다.");

                } else {
                    const user_pwd = result.rows[0].user_pwd;
                    const user_salt = result.rows[0].user_salt;

                    // 복호화
                    const crypto_pwd = hashCheck(user_salt, pwd);

                    if (user_pwd == crypto_pwd) {

                        // db
                        sql = 'UPDATE user SET user_YN=\'Y\', user_leave=CURRENT_TIMESTAMP where user_id=?';
                        DB(sql, params).then((result) => {
                            if (!result.state) {
                                console.log(result.err);
                                resultMSG(res, -1, "탈퇴에 실패하였습니다.");

                            } else {
                                req.logout();
                                resultMSG(res, 1, "탈퇴가 완료되었습니다.");
                            }
                        });

                    } else {
                        resultMSG(res, -1, "탈퇴에 실패하였습니다.");
                    }
                }
            }
        })
    }
})

module.exports = router;