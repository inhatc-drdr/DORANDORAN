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

    console.log(
        `[${new Date().toLocaleString()}] [token] authHeader=${authHeader}`
    );

    if (!token) {
        console.log(
            `[${new Date().toLocaleString()}] [retrun ] 토큰 값이 존재하지 않음(400)`
        );
        return res.status(400).send({ 'error': 400 });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            console.log(
                `[${new Date().toLocaleString()}] [retrun ] 토큰 값이 유효하지 않음(403)`
            );
            return res.status(403).send({ 'error': 403 });
        }

        req.user = user;
        next();
    });
};