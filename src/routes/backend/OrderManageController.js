import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, AuthAdmin, Required, DefaultValue } from '../../lib/decorator'
import { OrderService } from '../../service'

const orderService = new OrderService()

@controller('/manage/order')
export class OrderManageController {

    //####1.订单List
    // /manage/order/list.do
    @all('/list.do')
    // @AuthAdmin()
    @DefaultValue({
        pageNum: 1,
        pageSize: 10
    })
    async orderList(ctx, next) {
        let pageNum = Number(ctx.body.pageNum)
        let pageSize = Number(ctx.body.pageSize)
        let result = await orderService.manageList(pageNum,pageSize)
        ctx.body = result
    }

    //####2.按订单号查询
    // /manage/order/search.do
    @all('/search.do')
    // @AuthAdmin()
    @Required({
        query: ['orderNo']
    })
    @DefaultValue({
        pageNum: 1,
        pageSize: 10
    })
    async search(ctx, next) {
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let pageNum = Number(ctx.body.pageNum)
        let pageSize = Number(ctx.body.pageSize)
        let result = await orderService.manageSearch(orderNo,pageNum,pageSize)
        ctx.body = result
    }

    //####3.订单详情
    // /manage/order/detail.do
    @all('/detail.do')
    // @AuthAdmin()
    @Required({
        query: ['orderNo']
    })
    async detail(ctx, next) {
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let result = await orderService.manageDetail(orderNo)
        ctx.body = result
    }

    //####4.订单发货
    // /manage/order/send_goods.do
    @all('/send_goods.do')
    // @AuthAdmin()
    @Required({
        query: ['orderNo']
    })
    async orderSendGoods(ctx, next) {
        let orderNo = ctx.body.orderNo || ctx.query.orderNo
        let result = await orderService.manageSendGoods(orderNo)
        ctx.body = result
    }






}