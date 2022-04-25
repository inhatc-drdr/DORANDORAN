const crypto = require('crypto');

// 암호화
export function hashCreate(password) {
    const salt = crypto.randomBytes(32).toString('hex')
    const crypto_pwd = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex')
    const result = { "salt": salt, "pwd": crypto_pwd }
    return result
}

// 복호화
export function hashCheck(salt, password) {
    const crypto_pwd = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex')
    return crypto_pwd
}

