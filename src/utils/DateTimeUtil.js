const moment = require('moment')
const R = require('ramda')
export class DateTimeUtil{
    static dateToStr(date){
        if(R.isEmpty(date)){
            return ''
        }
        return moment(date).format("YYYY-MM-DD HH:mm:SS")
    }
}