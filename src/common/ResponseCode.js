class ResponseCode {
    static SUCESS           = {code: 0, desc: 'SUCESS'}
    static ERROR            = {code: 1, desc: 'ERROR'}
    static NEED_LOGIN       = {code: 10, desc: 'NEED_LOGIN'}
    static ILLEGAL_ARGUMENT = {code: 2, desc: 'ILLEGAL_ARGUMENT'}
    static getDescByCode(code){
        if(code === 0) {
            return ResponseCode.SUCESS.desc
        }else if(code === 1){
            return ResponseCode.ERROR.desc
        }else if(code === 10){
            return ResponseCode.NEED_LOGIN.desc
        }else if(code === 2){
            return ResponseCode.ILLEGAL_ARGUMENT.desc
        }else{
            return ''
        }
    }
}
module.exports = {
    ResponseCode
}