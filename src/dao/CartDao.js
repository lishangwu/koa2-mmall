import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Cart = model[Const.Entity.Cart]

class CartDao {

    async insert(cart){
        return await Cart.create(cart)
    }

    async selectCartByUserid(userId){
        return await Cart.findAll({
            where: {user_id: userId}
        })
    }

    async updateByPrimaryKeySelective(cart){
        let set = {}
        for (let attr in cart) {
            if (cart[attr] !== '') {
                set[attr] = cart[attr]
            }
        }
        return await Cart.update(
            set,
            { where: { id: cart.id } }
        )
    }

    async deleteByUserIdProductIds(userId,productList){
        return await Cart.destroy({
            where: {
                user_id: userId,
                product_id: productList
            }
        })
    }

    async checkedOrUncheckedProduct(userId,productId,checked){
        let where = {}
        where.user_id = userId
        if(productId){
            where.product_id = productId
        }
        return await Cart.update(
            {checked: checked},
            {
                where: where
            }
        )
    }

    async selectCartProductCount(userId){
        return await Cart.count({
            where: {
                user_id: userId
            }
        })
    }

    async selectCartProductCheckedStatusByUserId(userId){
        return await Cart.count({
            where: {
                checked: 0,
                user_id: userId
            }
        })
    }
    
    async selectCartByUserIDProductID(userId, productId){
        return await Cart.findOne({
            where: {user_id: userId, product_id: productId}
        })
    }

    async selectCheckedCartByUserId(userId){
        return await Cart.findAll({
            where: {
                user_id: userId,
                checked: Const.Cart.CHECKED
            }
        })
    }

    async deleteByPrimaryKey(id){
        return await Cart.destroy({
            where: {id :id}
        })
    }
}

module.exports = {
    CartDao
}