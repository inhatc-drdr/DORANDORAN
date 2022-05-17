const { DB } = require("../models/config");
const { resultMSG } = require("./send");

// 서버 접근 가능 여부 확인
export function srvRequired(req, res, next) {

    const user_id = req.user.id;
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