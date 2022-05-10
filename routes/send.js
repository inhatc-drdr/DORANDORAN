export function resultMSG(res, result, msg) {

    console.log(
        `[${new Date().toLocaleString()}] [retrun ] {result:${result}, msg:${msg}}`
    );

    res.send({
        result: result,
        msg: msg,
    });
}

export function resultList(res, result, admin_yn, list) {

    console.log(
        `[${new Date().toLocaleString()}] [retrun ] {result:${result}, admin_yn:${admin_yn || null}, list:${list}}`
    );

    if (admin_yn) {
        return res.send({
            result: result,
            admin_yn: admin_yn,
            list: list,
        })
    }

    res.send({
        result: result,
        list: list,
    });
}