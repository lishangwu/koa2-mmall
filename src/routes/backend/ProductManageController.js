import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, AuthAdmin, Required, DefaultValue } from '../../lib/decorator'
import { ProductService, FileService } from '../../service'

const productService = new ProductService()
const fileService = new FileService()

@controller('/manage/product')
export class ProductManageController {

    //####1.产品list
    // /manage/product/list.do
    @all('/list.do')
    @AuthAdmin()
    @DefaultValue({
        pageNum: 1,
        pageSize: 10
    })
    async getList(ctx, next) {
        let pageNum = Number(ctx.body.pageNum)
        let pageSize = Number(ctx.body.pageSize)
        let result = await productService.getProductList(pageNum,pageSize)
        ctx.body = result
    }

    //####2.产品搜索
    // /manage/product/search.do
    @all('/search.do')
    @AuthAdmin()
    @DefaultValue({
        productName: '',
        productId: '',
        pageNum: 1,
        pageSize: 10
    })
    async productSearch(ctx, next) {
        let productName = ctx.body.productName
        let productId = ctx.body.productId
        let pageNum = Number(ctx.body.pageNum)
        let pageSize = Number(ctx.body.pageSize)
        let result = await productService.searchProduct(productName,productId,pageNum,pageSize)
        ctx.body = result
    }

    //####3.图片上传
    // /manage/product/upload.do
    @all('/upload.do')
    @AuthAdmin()
    async upload(ctx, next) {
        let result = await fileService.upload(ctx.request.files.myfile)
        return ctx.body = result

    }

    //####4.产品详情
    ///manage/product/detail.do
    @all('/detail.do')
    @AuthAdmin()
    @Required({
        body: ['productId']
    })
    async detail(ctx, next) {
        let productId = ctx.body.productId
        let result = await productService.manageProductDetail(productId)
        ctx.body = result
    }

    //####5.产品上下架
    ///manage/product/set_sale_status.do
    @all('/set_sale_status.do')
    @AuthAdmin()
    @Required({
        body: ['productId', 'status']
    })
    async setSaleStatus(ctx, next) {
        let productId = ctx.body.productId
        let status = ctx.body.status
        let result = await productService.setSaleStatus(productId, status)
        ctx.body = result
    }

    //####6.新增OR更新产品
    ///manage/product/save.do
    //categoryId=1&
    // name=三星洗衣机&
    // subtitle=三星大促销&
    // mainImage=sss.jpg&
    // subImages=test.jpg&
    // detail=detailtext&
    // price=1000&stock=100&
    // status=1&id=3
    //------------>  query :  { categoryId: '1',
    //   name: '三星洗衣机',
    //   subtitle: '三星大促销',
    //   subImages: 'test.jpg,11.jpg,2.jpg,3.jpg',
    //   detail: 'detailtext',
    //   price: '1000',
    //   stock: '100',
    //   status: '1' }
    // save: http://localhost:5000/manage/product/save.do?categoryId=1&name=三星洗衣机&subtitle=三星大促销&subImages=test.jpg,11.jpg,2.jpg,3.jpg&detail=detailtext&price=1000&stock=100&status=1
    // update: http://localhost:5000/manage/product/save.do?categoryId=1&name=三星洗衣机&subtitle=三星大促销sb&subImages=test.jpg&detail=detailtext&price=1000&stock=100&status=1&id=50
    @all('/save.do')
    @AuthAdmin()
    // @Required({
    //     body: ['categoryId', 'name', 'subtitle', 'subImages', 'detail', 'price', 'stock', 'status']
    // })
    async save(ctx, next) {
        let product = ctx.body || ctx.query
        let result = await productService.saveOrUpdateProduct(product)
        ctx.body = result
    }

    //####7.富文本上传图片
    // /manage/product/richtext_img_upload.do
    @all('/richtext_img_upload.do')
    @AuthAdmin()
    async richtextImgUpload(ctx, next) {
        let result = await fileService.upload(ctx.request.files.myfile)
        return ctx.body = result
    }

}