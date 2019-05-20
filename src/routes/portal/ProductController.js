import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, Required, DefaultValue } from '../../lib/decorator'
import { ProductService } from '../../service'

const productService = new ProductService()

@controller('/product')
export class ProductController {

    //####1.产品搜索及动态排序List
    // //product/list.do
    @all('/list.do')
    @Required({
        query: ['categoryId']
    })
    @DefaultValue({
        keyword: '',
        pageNum : 1,
        pageSize: 10,
        orderBy: 'price_desc' //price_desc，price_asc
    })
    async login(ctx, next) {
        let keyword = ctx.query.keyword
        let categoryId = ctx.query.categoryId
        let pageNum = ctx.query.pageNum
        let pageSize = ctx.query.pageSize
        let orderBy = ctx.query.orderBy
        let result = await productService.getProductByKeywordCategory(keyword,categoryId,pageNum,pageSize,orderBy)
        ctx.body = result
    }

    //####2.产品detail
    ///product/detail.do
    @all('/detail.do')
    @Required({
        // body: ['productId'],
        query: ['productId']
    })
    async detail(ctx, next) {
        let productId = ctx.body.productId || ctx.query.productId
        let result = await productService.getProductDetail(productId)
        ctx.body = result
    }


}