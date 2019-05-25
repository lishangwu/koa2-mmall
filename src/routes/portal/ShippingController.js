import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, Required, DefaultValue } from '../../lib/decorator'
import { ShippingService } from '../../service'

const shippingService = new ShippingService()

@controller('/shipping')
export class ShippingController {

    //####1.添加地址
    // /shipping/add.do
    @all('/add.do')
    // @Auth()
    @Required({
        body:['receiverName', 'receiverPhone', 'receiverMobile', 'receiverProvince', 'receiverCity', 'receiverAddress', 'receiverZip']
    })
    async add(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let result = await shippingService.add(userid, ctx.body)
        ctx.body = result
    }

    //####2.删除地址
    // /shipping/del.do
    @all('/del.do')
    // @Auth()
    @Required({
        body: ['shippingId']
    })
    async del(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let shippingId = ctx.body.shippingId
        let userid = 36
        let result = await shippingService.del(userid, shippingId)
        ctx.body = result
    }

    //####3.登录状态更新地址
    // /shipping/update.do
    @all('/update.do')
    // @Auth()
    @Required({
        body:['id','receiverName', 'receiverPhone', 'receiverMobile', 'receiverProvince', 'receiverCity', 'receiverAddress', 'receiverZip']
    })
    async list(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let result = await shippingService.update(userid, ctx.body)
        ctx.body = result
    }

    //####4.选中查看具体的地址
    // /shipping/select.do
    @all('/select.do')
    // @Auth()
    @Required({
        body: ['shippingId']
    })
    async select(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let result = await shippingService.select(userid, ctx.body.shippingId)
        ctx.body = result
    }

    //####5.地址列表
    // /shipping/list.do
    @all('/list.do')
    // @Auth()
    async list(ctx, next) {
        // let userid = ctx.session[Const.CURRENT_USER].id
        let userid = 36
        let result = await shippingService.list(userid)
        ctx.body = result
    }


}