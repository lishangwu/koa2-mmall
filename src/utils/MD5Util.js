const crypto = require('crypto')

const SECRET_KEY = 'sbsbsbsb'

class MD5Util{
    static md5(content) {
        return crypto.createHash('md5').update(content).digest('hex')
    }

    static genPassword(password) {
        return md5(`password=${password}&key=${SECRET_KEY}`)
    }
}
module.exports = {
    MD5Util
}