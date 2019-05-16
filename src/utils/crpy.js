const crypto = require('crypto')

const SECRET_KEY = 'sbsbsbsb'

function md5(content) {
    return crypto.createHash('md5').update(content).digest('hex')
}

function genPassword(password) {
    return md5(`password=${password}&key=${SECRET_KEY}`)
}

module.exports = {
    md5,
    genPassword
}