import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Order_item = model[Const.Entity.Order_item]

class OrderItemDao {


    async batchInsert(orderItemList){
        return await OrderItemDao.bulkCreate(orderItemList)
    }

    async getByOrderNo(order_no){
        return await Order_item.findAll({
            where : {order_no : order_no}
        })
    }

    async getByOrderNoUserId(order_no, userId){
        return await Order_item.findAll({
            where : {order_no : order_no, user_id: userId}
        })
    }

}

module.exports = {
    OrderItemDao
}