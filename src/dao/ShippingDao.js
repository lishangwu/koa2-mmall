import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Shipping = model[Const.Entity.Shipping]

class ShippingDao {

    async insert(shipping) {
        return await Shipping.create(shipping)
    }

    async deleteByShippingIdUserId(userid, shippingId) {
        return await Shipping.destroy({
            where: {
                user_id: userid,
                id: shippingId
            }
        })
    }

    async updateByShipping(shipping){
        return await Shipping.update(
            shipping,
            {
                where: {id:shipping.id, user_id:shipping.user_id}
            }
        )
    }

    async selectByShippingIdUserId(userId,shippingId){
        return await Shipping.findOne({
            where: {
                id: shippingId,
                user_id: userId
            }
        })
    }

    async selectByUserId(userId){
        return await Shipping.findAll({
            where: {
                user_id: userId
            }
        })
    }

}

module.exports = {
    ShippingDao
}