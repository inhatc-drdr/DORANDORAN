const jwt = require("jsonwebtoken");

// access token을 secret key 기반으로 생성
export const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
    });
};

// refersh token을 secret key  기반으로 생성
export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days",
    });
};

// access token의 유효성 검사
export const authenticateAccessToken = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log("올바르지 않은 토큰 전송");
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            console.log(error);
            // 토큰 만료
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};