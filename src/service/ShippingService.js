import { ServerResponse, Const, TokenCache, ResponseCode } from '../common'
import { MD5Util, UUID } from '../utils'
import { ShippingDao } from '../dao'

const numeral = require('numeral')

const R = require('ramda')
const shippingDao = new ShippingDao()

class ShippingService {

    async add(userId, shipping) {
        shipping.user_id = userId
        let o = {}
        o.user_id = shipping.user_id
        o.receiver_name = shipping.receiverName
        o.receiver_phone = shipping.receiverPhone
        o.receiver_mobile = shipping.receiverMobile
        o.receiver_province = shipping.receiverProvince
        o.receiver_city = shipping.receiverCity
        o.receiver_address = shipping.receiverAddress
        o.receiver_zip = shipping.receiverZip
        let rowResult = await shippingDao.insert(o)
        return ServerResponse.createBySuccess({ shippingId: rowResult.id })
    }

    async del(userid, shippingId) {
        let result = await shippingDao.deleteByShippingIdUserId(userid, shippingId);
        if(result > 0){
            return ServerResponse.createBySuccess('删除地址成功')
        }
        return ServerResponse.createByErrorMessage('删除地址失败')
    }

    async update(userid, shipping){
        shipping.user_id = userId
        let o = {}
        o.user_id = shipping.user_id
        o.receiver_name = shipping.receiverName
        o.receiver_phone = shipping.receiverPhone
        o.receiver_mobile = shipping.receiverMobile
        o.receiver_province = shipping.receiverProvince
        o.receiver_city = shipping.receiverCity
        o.receiver_address = shipping.receiverAddress
        o.receiver_zip = shipping.receiverZip

        o.id = shipping.id

        let uptResult = await shippingDao.updateByShipping(o)
        if(uptResult > 0){
            return ServerResponse.createBySuccess('更新地址成功')
        }
        return ServerResponse.createBySuccess('更新地址失败')
    }

    async select(userId, shippingId){
        let shipping = await shippingDao.selectByShippingIdUserId(userId,shippingId);
        if (shipping == null) {
            return ServerResponse.createByErrorMessage("无法查询到改地址");
        }
        return ServerResponse.createBySuccess(shipping);
    }

    async list(userId){
        let shippingList = await shippingDao.selectByUserId(userId)
        return ServerResponse.createBySuccess(shippingList);
    }

}

module.exports = {
    ShippingService
}