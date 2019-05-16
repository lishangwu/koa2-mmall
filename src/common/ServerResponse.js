const { ResponseCode } = require('./ResponseCode')

class ServerResponse {
    constructor(code, desc, data, message) {
        this.code = code
        this.desc = desc
        if (typeof data === 'string') {
            this.message = data
            data         = null
            message      = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
    isSuccess() {
        return this.code === ResponseCode.SUCESS.code
    }
    static createBySuccess() {
        return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc)
    }
    static createBySuccessMessage(message) {
        return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc, message)
    }
    static createBySuccessData(data) {
        return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc, data)
    }
    static createBySuccessMessageData(message, data) {
        return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc, data, message)
    }
    static createByError() {
        return new ServerResponse(ResponseCode.ERROR.code, ResponseCode.ERROR.desc)
    }
    static createByErrorMessage(errorMessage) {
        return new ServerResponse(ResponseCode.ERROR.code, ResponseCode.ERROR.desc, errorMessage)
    }
    static createByErrorCodeMessage(errorCode, errorMessage) {
        return new ServerResponse(errorCode, ResponseCode.getDescByCode(errorCode), errorMessage)
    }
}
module.exports = {
    ServerResponse
}