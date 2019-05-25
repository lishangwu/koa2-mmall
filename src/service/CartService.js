import { ServerResponse, Const, TokenCache, ResponseCode } from '../common'
import { MD5Util, UUID } from '../utils'
import { CartDao, ProductDao } from '../dao'
import {CartProductVo, CartVo} from "../vo";

const numeral = require('numeral')

const R = require('ramda')
const cartDao = new CartDao()
const productDao = new ProductDao()

class CartService {

    async add(userId, productId, count){
        if(productId == null || count == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.code,ResponseCode.ILLEGAL_ARGUMENT.desc);
        }
        let cart = await cartDao.selectCartByUserIDProductID(userId, productId)

        if(cart == null){
            let cartItem = {}
            cartItem.user_id = userId
            cartItem.product_id = productId ////判断这个productId是否存在??
            cartItem.checked = Const.Cart.CHECKED
            cartItem.quantity = count
            await cartDao.insert(cartItem)

        }else{
            cart.quantity = cart.quantity + count
            // await cartDao.updateByPrimaryKeySelective(cart)
            await cart.save()
        }

        return await this.list(userId)

    }

    async update(userId, productId, count){
        if(productId == null || count == null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.code,ResponseCode.ILLEGAL_ARGUMENT.desc);
        }
        let cart = await cartDao.selectCartByUserIDProductID(userId, productId)

        if(cart == null){
            let cartItem = {}
            cartItem.user_id = userId
            cartItem.product_id = productId // 判断这个productId是否存在?? ,判断库存
            cartItem.checked = Const.Cart.CHECKED
            cartItem.quantity = count
            await cartDao.insert(cartItem)

        }else{
            cart.quantity = count // 判断这个productId是否存在?? ,判断库存
            // await cartDao.updateByPrimaryKeySelective(cart)
            await cart.save()
        }
        return await this.list(userId)

    }

    async deleteProduct(userId, productIds){
        let productList = productIds.split(',')
        if(R.isEmpty(productList)){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.code,ResponseCode.ILLEGAL_ARGUMENT.desc);
        }

        await cartDao.deleteByUserIdProductIds(userId,productList)

        return await this.list(userId)
    }

    async selectOrUnselect(userId, productId, checked){
        await cartDao.checkedOrUncheckedProduct(userId,productId,checked);
        return await this.list(userId)
    }

    async getCartProductCount(userId){
        let result = await cartDao.selectCartProductCount(userId)
        return ServerResponse.createBySuccess(result)
    }

    async list(userid){
        let cartVo = await this.getCartVoLimit(userid)
        return ServerResponse.createBySuccess(cartVo)
    }

    async getCartVoLimit(userId){
        let cartVo = new CartVo()
        let cartList = await cartDao.selectCartByUserid(userId)

        let cartProductVoList = []

        let cartTotalPrice = numeral(0)
        if(!R.isEmpty(cartList)){
            for (let cartItem of cartList){
                let cartProductVo = new CartProductVo()
                cartProductVo.id = cartItem.id
                cartProductVo.userId = cartItem.user_id
                cartProductVo.productId = cartItem.product_id

                let product = await productDao.selectByPrimaryKey(cartItem.id)
                if(product != null){
                    cartProductVo.productMainImage = product.main_image
                    cartProductVo.productName = product.name
                    cartProductVo.productSubtitle = product.subtitle
                    cartProductVo.productPrice = product.price
                    cartProductVo.productStock = product.stock

                    //判断库存
                    let buyLimitCount = 0
                    if(product.stock >= cartItem.quantity){
                        buyLimitCount = cartItem.quantity
                        cartProductVo.limitQuantity = Const.Cart.LIMIT_NUM_SUCCESS
                    }else{
                        buyLimitCount = product.stock
                        cartProductVo.limitQuantity = Const.Cart.LIMIT_NUM_FAIL
                        //购物车中更新有效库存
                        let cartForQuantity = {}
                        cartForQuantity.id = cartItem.id
                        cartForQuantity.quantity = buyLimitCount
                        await cartDao.updateByPrimaryKeySelective(cartForQuantity)
                    }


                    cartProductVo.quantity = buyLimitCount
                    //计算总价
                    cartProductVo.productTotalPrice = numeral( product.price).multiply( cartProductVo.quantity ).value()
                    cartProductVo.productChecked = cartItem.checked

                }

                if(cartItem.checked == Const.Cart.CHECKED){
                    //如果已经勾选,增加到整个的购物车总价中
                    cartTotalPrice.add( cartProductVo.productTotalPrice )
                }

                cartProductVoList.push(cartProductVo)

            }

        }

        cartVo.cartTotalPrice = cartTotalPrice.value()
        cartVo.cartProductVoList = cartProductVoList
        cartVo.allChecked = await this.getAllCheckedStatus(userId)

        return cartVo
    }

    async  getAllCheckedStatus(userId){
        if(userId == null){
        return false;
        }
        return await cartDao.selectCartProductCheckedStatusByUserId(userId) == 0;
    }
    
}

module.exports = {
    CartService
}