const uuid = require('node-uuid')

class UUID{
    static randomUUID(){
        return uuid.v4().replace(/-/g, '')
    }
}

module.exports = {
    UUID
}