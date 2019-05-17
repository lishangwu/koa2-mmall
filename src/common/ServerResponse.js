const { ResponseCode } = require('./ResponseCode')

class ServerResponse {
    constructor(code, desc, data, message) {
        this.status = code
        this.msg = desc
        //error
        if(this.status !== ResponseCode.SUCESS.code){
            if (typeof data === 'string') {
                this.msg = data
                data         = null
                message      = null
            }
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.msg = message
        }
    }
    isSuccess() {
        return this.status === ResponseCode.SUCESS.code
    }
    static createBySuccess() {
        if(arguments.length === 0){
            return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc)
        }else if(arguments.length === 1){
            // data
            return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc, arguments[0])
        }else if(arguments.length === 2){
            // msg data
            return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc, arguments[1], arguments[0])
        }else {
            throw new Error('createBySuccess param error..')
        }
    }
    static createBySuccessMessage(message) {
        return new ServerResponse(ResponseCode.SUCESS.code, ResponseCode.SUCESS.desc, message)
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