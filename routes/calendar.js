// ***********************************************************
// CANENDAR API
// ***********************************************************
// @description : 일정 관련 라우터
//  - 일정 등록 조회, 상세
// @date : 2022-05-05
// @modifier : 노예원
// @did
//  - 
// @todo
//  - 
// ***********************************************************

const router = require("express").Router();
const DB = require("../models/config");
const { resultMSG } = require("../app");
const { loginRequired, srvRequired, adminRequired } = require("./required");

router.get("/", srvRequired, (req, res) => {
    console.log('asdsfdsfsfsfsfs')
    res.send('11')
})

module.exports = router;
