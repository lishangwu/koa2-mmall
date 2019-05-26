import { ServerResponse, Const, TokenCache, ResponseCode } from '../common'
import { MD5Util, UUID, DateTimeUtil } from '../utils'
import { OrderDao, CartDao, ProductDao, OrderItemDao, ShippingDao } from '../dao'
import { OrderVo, ShippingVo, OrderItemVo, OrderProductVo } from "../vo";

const numeral = require('numeral')

const R = require('ramda')
const orderDao = new OrderDao()
const cartDao = new CartDao()
const productDao = new ProductDao()
const orderItemDao = new OrderItemDao()
const shippingDao = new ShippingDao()



class OrderService {

    async createOrder(userId, shippingId) {
        let cartList = await cartDao.selectCheckedCartByUserId(userId)
        // TODO
        // cartList.length > 0 ? cartList = [cartList[0]] : ''
        //把购物车里选中的产品 从产品库里拿出来封装数组
        let sp = await this.getCartOrderItem(userId, cartList)
        if (!sp.isSuccess()) {
            return sp
        }

        let orderItemList = sp.data
        if (R.isEmpty(orderItemList)) {
            return ServerResponse.createByErrorMessage("购物车为空");
        }

        //计算订单总价
        let payment = this.getOrderTotalPrice(orderItemList)

        //生成订单
        let order = await this.assembleOrder(userId, shippingId, payment)

        if (order == null) {
            return ServerResponse.createByErrorMessage("生成订单错误")
        }

        for (let orderItem of orderItemList) {
            orderItem.order_no = order.order_no
        }

        //批量插入
        await orderItemDao.batchInsert(orderItemList)

        //生成成功,我们要减少我们产品的库存
        await this.reduceProductStock(orderItemList);

        //清空一下购物车
        await this.cleanCart(cartList);

        //返回给前端数据
        let orderVo = await this.assembleOrderVo(order, orderItemList);
        return ServerResponse.createBySuccess(orderVo)

    }

    async getOrderCartProduct(userId){
        let orderProductVo = new OrderProductVo()
        //从购物车中获取数据
        let cartList = await cartDao.selectCheckedCartByUserId(userId)
        let sp = await this.getCartOrderItem(userId, cartList)
        if (!sp.isSuccess()) {
            return sp
        }

        let orderItemList = sp.data

        let orderItemVoList = []

        let payment = numeral(0)
        for(let orderItem of orderItemList){
            payment.add(orderItem.total_price)
            orderItemVoList.push(orderItem)
        }
        orderProductVo.productTotalPrice = payment.value()
        orderProductVo.orderItemVoList = orderItemList
        orderProductVo.imageHost = Const.ftp_server_http_prefix
        return ServerResponse.createBySuccess(orderProductVo)

    }

    async getOrderList(userId, pageNum,pageSize){
        const  { total, docs, pages } = await orderDao.selectByUserId(userId, pageNum,pageSize)
        let orderList  = docs
        let orderVoList = await this.assembleOrderVoList(orderList, userId)
        return ServerResponse.createBySuccess( { total, orderVoList, pages } )
    }

    async getOrderDetail(userId, orderNo){
        let order = await orderDao.selectByUserIdAndOrderNo(userId, orderNo)
        console.log(order.dataValues);
        if(order != null){
            let orderItemList = await orderItemDao.getByOrderNoUserId(orderNo, userId)
            let orderVo = await this.assembleOrderVo(order, orderItemList)
            return ServerResponse.createBySuccess(orderVo)
        }
        return ServerResponse.createByErrorMessage('没有找到该订单')
    }

    async cancel(userId, orderNo){
        let order = await orderDao.selectByUserIdAndOrderNo(userId, orderNo)
        if(order == null){
            return ServerResponse.createByErrorMessage('该用户此订单不存在')
        }
        if(order.status != Const.OrderStatusEnum.NO_PAY.code){
            return ServerResponse.createByErrorMessage('已付款,无法取消订单 : ' + Const.OrderStatusEnum.codeOf(order.status).value)
        }

        let updateOrder = {}
        updateOrder.id = order.id
        updateOrder.status = Const.OrderStatusEnum.CANCELED.code
        let row = await orderDao.updateByPrimaryKeySelective(updateOrder)
        if(row > 0){
            return ServerResponse.createBySuccess();
        }
        return ServerResponse.createByError();
    }

    async assembleOrderVoList(orderList, userId){
        let orderVoList = []
        for(let order of orderList){
            let orderItemList = []
            if(userId == null){
                orderItemList = await orderItemDao.getByOrderNo(order.order_no)
            }else{
                orderItemList = await orderItemDao.getByOrderNoUserId(order.order_no, userId)
            }
            let orderVo = await this.assembleOrderVo(order, orderItemList)
            orderVoList.push(orderVo)
        }
        return orderVoList
    }

    async assembleOrderVo(order, orderItemList) {
        let orderVo = new OrderVo()
        orderVo.orderNo = order.order_no
        orderVo.payment = order.payment
        orderVo.paymentType = order.payment_type
        orderVo.paymentTypeDesc = Const.PaymentTypeEnum.codeOf(order.payment_type).value
        orderVo.postage = order.postage
        orderVo.status = order.status
        orderVo.statusDesc = Const.OrderStatusEnum.codeOf(order.status).value
        orderVo.shippingId = order.shipping_id
        let shipping = await shippingDao.selectByPrimaryKey(order.shipping_id)
        if (shipping != null) {
            orderVo.receiverName = shipping.receiver_name
            orderVo.shippingVo = this.assembleShippingVo(shipping)
        }
        orderVo.paymentTime = DateTimeUtil.dateToStr( order.payment_time )
        orderVo.sendTime = DateTimeUtil.dateToStr( order.send_time )
        orderVo.endTime = DateTimeUtil.dateToStr( order.end_time )
        orderVo.createTime = DateTimeUtil.dateToStr( order.create_time )
        orderVo.closeTime = DateTimeUtil.dateToStr( order.close_time )

        orderVo.imageHost = Const.ftp_server_http_prefix

        let orderItemVoList = []
        for (let orderItem of orderItemList) {
            let orderItemVo = this.assembleOrderItemVo(orderItem)
            orderItemVoList.push(orderItemVo)
        }

        orderVo.orderItemVoList = orderItemVoList
        return orderVo
    }

    assembleOrderItemVo(orderItem) {
        let orderItemVo = new OrderItemVo()
        orderItemVo.orderNo = orderItem.order_no
        orderItemVo.productId = orderItem.product_id
        orderItemVo.productName = orderItem.product_name
        orderItemVo.productImage = orderItem.product_image
        orderItemVo.currentUnitPrice = orderItem.current_unit_price
        orderItemVo.quantity = orderItem.quantity
        orderItemVo.totalPrice = orderItem.total_price
        orderItemVo.createTime = DateTimeUtil.dateToStr( orderItem.create_time )

        return orderItemVo
    }

    assembleShippingVo(shipping) {
        let shippingVo = new ShippingVo()
        shippingVo.receiverName = shipping.receiver_name
        shippingVo.receiverAddress = shipping.receiver_address
        shippingVo.receiverProvince = shipping.receiver_province
        shippingVo.receiverCity = shipping.receiver_city
        shippingVo.receiverDistrict = shipping.receiver_district
        shippingVo.receiverMobile = shipping.receiver_mobile
        shippingVo.receiverZip = shipping.receiver_phone
        return shippingVo
    }

    async cleanCart(cartList) {
        for (let cart of cartList) {
            await cartDao.deleteByPrimaryKey(cart.id)
        }
    }

    async reduceProductStock(orderItemList) {
        for (let orderItem of orderItemList) {
            let product = await productDao.selectByPrimaryKey(orderItem.product_id)
            product.stock = product.stock - orderItem.quantity
            product.save()
        }
    }

    async assembleOrder(userId, shippingId, payment) {
        let order = {}
        order.order_no = this.generateOrderNo()
        order.status = Const.OrderStatusEnum.NO_PAY.code
        order.postage = 0
        order.payment_type = Const.PaymentTypeEnum.ONLINE_PAY.code
        order.payment = payment
        order.user_id = userId
        order.shipping_id = shippingId

        let rowResult = await orderDao.insert(order)
        if (rowResult._options.isNewRecord) {
            return order
        }
        return null

    }

    getOrderTotalPrice(orderItemList) {
        let payment = numeral(0)
        for (let orderItem of orderItemList) {
            payment.add(orderItem.total_price)
        }
        return payment.value()
    }

    async getCartOrderItem(userId, cartList) {
        
        let orderItemList = []

        if (R.isEmpty(cartList)) {
            return ServerResponse.createByErrorMessage('购物车为空')
        }

        for (let cartItem of cartList) {
            let orderItem = {}
            let product = await productDao.selectByPrimaryKey(cartItem.product_id)
            if(product == null){
                return ServerResponse.createByErrorMessage("产品 product.id :" + cartItem.product_id + " 不存在");
            }
            if (Const.ProductStatusEnum.ON_SALE.code != product.status) {
                return ServerResponse.createByErrorMessage("产品" + product.name + "不是在线售卖状态");
            }
            //校验库存
            if (cartItem.quantity > product.stock) {
                return ServerResponse.createByErrorMessage("产品" + product.getName() + "库存不足");
            }

            orderItem.user_id = userId
            orderItem.product_id = product.id
            orderItem.product_name = product.name
            orderItem.product_image = product.main_image
            orderItem.current_unit_price = product.price
            orderItem.quantity = cartItem.quantity
            orderItem.total_price = numeral(product.price).multiply(cartItem.quantity).value()

            orderItemList.push(orderItem)
        }

        return ServerResponse.createBySuccess(orderItemList)
    }

    generateOrderNo() {
        let currentTime = Date.now()
        return currentTime + Math.floor(Math.random() * 100)
    }


}

module.exports = {
    OrderService
}