import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, Required, DefaultValue } from '../../lib/decorator'
import { OrderService } from '../../service'

const orderService = new OrderService()

@controller('/order')
export class OrderController {

    // ####1.创建订单
    // /order/create.do
    @all('/create.do')
    // @Auth()
    @Required({
        query: ['shippingId']
    })
    async create(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let shippingId = ctx.query.shippingId
        let result = await orderService.createOrder(userid, shippingId)
        ctx.body = result
    }

    // ####2.获取订单的商品信息
    // /order/get_order_cart_product.do
    @all('/get_order_cart_product.do')
    // @Auth()
    @Required({
        query: ['shippingId']
    })
    async get_order_cart_product(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let result = await orderService.getOrderCartProduct(userid)
        ctx.body = result
    }

    // ####3.订单List
    // /order/list.do
    @all('/list.do')
    // @Auth()
    @DefaultValue({
        pageSize : 10,
        pageNum : 1
    })
    async list(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let pageSize = ctx.body.pageSize
        let pageNum = ctx.body.pageNum
        let result = await orderService.getOrderList(userid, pageNum,pageSize)
        ctx.body = result
    }

    // ####4.订单详情detail
    // /order/detail.do
    @all('/detail.do')
    // @Auth()
    @Required({
        query: ['orderNo']
    })
    async detail(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let result = await orderService.getOrderDetail(userid, orderNo)
        ctx.body = result
    }

    // ####5.取消订单
    ///order/cancel.do
    @all('/cancel.do')
    // @Auth()
    @Required({
        query: ['orderNo']
    })
    async cancel(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let result = await orderService.cancel(userid, orderNo)
        ctx.body = result
    }



    //------------------------------------------------------------------------------------------------------------------pay

    //####1.支付
    // /order/pay.do
    @all('/pay.do')
    // @Auth()
    @Required({
        query: ['orderNo']
    })
    async pay(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let result = await orderService.pay(orderNo, userid)
        ctx.body = result
    }

    //####2.查询订单支付状态
    ///order/query_order_pay_status.do
    @all('/query_order_pay_status.do')
    // @Auth()
    @Required({
        query: ['orderNo']
    })
    async queryOrderPayStatus(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36;
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let result = await orderService.queryOrderPayStatus(orderNo, userid)
        ctx.body = result
    }

    // ####3.支付宝回调
    // 参考支付宝回调文档： https://support.open.alipay.com/docs/doc.htm?spm=a219a.7629140.0.0.mFogPC&treeId=193&articleId=103296&docType=1
    // /order/alipay_callback.do
    @all('/alipay_callback.do')
    // @Auth()
    @Required({
        // body:['orderNo']
    })
    async alipay_callback(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
    }



}