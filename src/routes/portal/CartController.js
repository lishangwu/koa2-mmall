import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, Required, DefaultValue } from '../../lib/decorator'
import { CartService } from '../../service'

const cartService = new CartService()

@controller('/cart')
export class CartController {

    //####1.产品搜索及动态排序List
    // //product/list.do
    @all('/list.do')
    @Auth()
    async list(ctx, next) {
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.list(userid)
        ctx.body = result
    }

    //####2.购物车添加商品
    // /cart/add.do
    @all('/add.do')
    // @Auth()
    @Required({
        body: ['productId','count']
    })
    async add(ctx, next){
        let productId = ctx.body.productId
        let count = Number(ctx.body.count)
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.add(userid, productId, count)
        ctx.body = result
    }

    //####3.更新购物车某个产品数量
    // /cart/update.do
    @all('/update.do')
    @Auth()
    @Required({
        body: ['productId','count']
    })
    async update(ctx, next){
        let productId = ctx.body.productId
        let count = Number(ctx.body.count)
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.update(userid, productId, count)
        ctx.body = result
    }

    //####4.移除购物车某个产品
    // /cart/delete_product.do
    @all('/delete_product.do')
    @Auth()
    @Required({
        body: ['productIds']
    })
    async delete_product(ctx, next){
        let productIds = ctx.body.productIds
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.deleteProduct(userid, productIds)
        ctx.body = result
    }

    //####5.购物车选中某个商品
    // /cart/select.do
    @all('/select.do')
    @Auth()
    @Required({
        body: ['productId']
    })
    async select(ctx, next){
        let productId = ctx.body.productId
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.selectOrUnselect(userid, productId, Const.Cart.CHECKED)
        ctx.body = result
    }

    //####6.购物车取消选中某个商品
    // /cart/select.do
    @all('/un_select.do')
    @Auth()
    @Required({
        body: ['productId']
    })
    async un_select(ctx, next){
        let productId = ctx.body.productId
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.selectOrUnselect(userid, productId, Const.Cart.UN_CHECKED)
        ctx.body = result
    }

    //####7.查询在购物车里的产品数量
    // /cart/get_cart_product_count.do
    @all('/get_cart_product_count.do')
    @Auth()
    async getCartProductCount(ctx, next){
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.getCartProductCount(userid)
        ctx.body = result
    }

    //####8.购物车全选
    // /cart/select_all.do
    @all('/select_all.do')
    @Auth()
    async select_all(ctx, next){
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.selectOrUnselect(userid, null, Const.Cart.CHECKED)
        ctx.body = result
    }

    //####8.购物车全选
    // /cart/un_select_all.do
    @all('/un_select_all.do')
    @Auth()
    async un_select_all(ctx, next){
        let userid = ctx.session[Const.CURRENT_USER].id
        let result = await cartService.selectOrUnselect(userid, null, Const.Cart.UN_CHECKED)
        ctx.body = result
    }


}