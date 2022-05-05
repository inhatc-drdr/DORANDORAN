const DB = require('../models/config');
const { resultMSG } = require("../app");

// 로그인 확인
export function loginRequired(req, res, next) {
    // 미 로그인
    if (!req.headers.id) {
        resultMSG(res, 0, "로그인 되어있지않습니다.");
        return;
    }
    next();
}

// 서버 접근 가능 여부 확인
export function srvRequired(req, res, next) {

    const user_id = req.headers.id;
    const srv_id = req.query.srv_id || req.body.srv_id;

    // 서버의 멤버인지 확인
    let sql =
        // "SELECT srvuser_id, s.user_id as admin_id FROM srvuser WHERE srv_id=? AND user_id=? AND srvuser_YN='N'";
        'SELECT srvuser_id, s.user_id as admin_id FROM srvuser su, srv s WHERE su.srv_id=? AND su.user_id=? AND su.srv_id = s.srv_id AND srvuser_YN=\'N\'';
    let params = [srv_id, user_id];
    DB(sql, params).then(function (result) {
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
            return;
        } else {
            if (!result.rows[0]) {
                resultMSG(res, -1, "접근 권한이 없습니다.");
                return;
            } else {

                let admin_id = result.rows[0].admin_id;
                req.data = {
                    srvuser_id: result.rows[0].srvuser_id,
                    admin_yn: (admin_id == user_id ? "y" : "n"),
                };

                next();
            }
        }
    })
}

// 관리자 접근 권한 여부 확인
export function adminRequired(req, res, next) {
    // 미 로그인
    if (!req.headers.id) {
        resultMSG(res, 0, "로그인 되어있지않습니다.");
        return;
    }

    const srv_id = req.body.srv_id || req.query.srv_id;
    console.log(srv_id);
    if (!srv_id) {
        resultMSG(res, -1, "서버가 선택되지 않았습니다.");
        return;
    }

    let sql = "SELECT user_id FROM srv WHERE srv_id=? AND srv_YN='N'";
    DB(sql, [srv_id]).then(function (result) {
        if (!result.state) {
            console.log(result.err);
            resultMSG(res, -1, "오류가 발생하였습니다.");
            return;
        } else {
            if (!result.rows[0]) {
                resultMSG(res, -1, "오류가 발생하였습니다.");
                return;
            } else {
                const admin_id = result.rows[0].user_id;
                if (req.headers.id != admin_id) {
                    resultMSG(res, -1, "접근 권한이 없습니다.");
                    return;
                } else {
                    next();
                }
            }
        }
    });
}