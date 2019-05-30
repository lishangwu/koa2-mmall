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
    async alipay_callback(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        console.log('alipay_callback : ' );
        console.info("支付宝回调,sign:{},trade_status:{},参数:{}");

        // ctx.request.body = test()
        let alipayRSACheckedV2 = orderService.rsaCheckV2(ctx.request.body)
        if(!alipayRSACheckedV2){
            ctx.body = ServerResponse.createByErrorMessage("非法请求,验证不通过,再恶意请求我就报警找网警了");
            return
        }else{
            console.log('**********************************************************');
            console.log('支付宝回调验证：',alipayRSACheckedV2);
            console.log('**********************************************************');
        }
        let result = await orderService.aliCallback(ctx.request.body)
        if(result.isSuccess()){
            ctx.body = Const.AlipayCallback.RESPONSE_SUCCESS
            return 
        }
        ctx.body = Const.AlipayCallback.RESPONSE_FAILED 
    }
}

function test(){
    return { gmt_create: '2019-05-30 11:50:26',
    charset: 'utf-8',
    seller_email: 'rwyahr0126@sandbox.com',
    subject: 'mmall扫码支付,订单号:1558874388704',
    sign:
     'bcwvYUh8nEMhtXLzslPOGcxqa2R5KioNk3FP48FYqFQzDjlgcAXsqaDGgwvg2BVv4CYvy3fgqLpl1efj0CQdqCWOEqkWt7mBHzQQjvOlGHsM7JEUj/q2wTK/aUG70xjdh2KcTtstggGp/dpRiMcalJjCFnGQVSM0aqRyN0P3NvOZR950oGhzan3fK4DrZSOEsK8AKVbu9u6pCi7nrDlpc6qnUhfGhSp8osXSgTkGyV1Zjm2wcbw5U5b2qSgf2vVjXaMZ7K6wmdkd5bPyyfITjfRbxedHxsooF/24T+TYaoxQL/cuzCQZ149qavcwjdHluz7UGxaaklWIg6w4P+hxVw==',
    buyer_id: '2088102176277911',
    invoice_amount: '1.00',
    notify_id: '2019053000222115033077911000232475',
    fund_bill_list: '[{"amount":"1.00","fundChannel":"ALIPAYACCOUNT"}]',
    notify_type: 'trade_status_sync',
    trade_status: 'TRADE_SUCCESS',
    receipt_amount: '1.00',
    buyer_pay_amount: '1.00',
    app_id: '2016091900545618',
    sign_type: 'RSA2',
    seller_id: '2088102176293461',
    gmt_payment: '2019-05-30 11:50:32',
    notify_time: '2019-05-30 11:50:33',
    version: '1.0',
    out_trade_no: '1558874388704',
    total_amount: '1.00',
    trade_no: '2019053022001477911000023578',
    auth_app_id: '2016091900545618',
    buyer_logon_id: 'cbu***@sandbox.com',
    point_amount: '0.00' }
}