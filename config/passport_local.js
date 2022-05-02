const { hashCreate, hashCheck } = require('./crypto');
const DB = require('../models/config');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
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
                passwordField: "pwd",
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
    
                            // 복호화
                            const crypto_pwd = hashCheck(user_salt, password);
    
                            if (user_pwd == crypto_pwd) {
    
                                login_result = 1;
                                login_id = result.rows[0].user_id;
    
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
}

