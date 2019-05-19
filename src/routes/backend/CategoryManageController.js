import { ServerResponse, Const } from '../../common'
import { controller, get, post, all, Auth, AuthAdmin, Required, DefaultValue } from '../../lib/decorator'
import { CategoryService } from '../../service'

const categoryService = new CategoryService()

@controller('/manage/category')
export class CategoryManageController {

    //####1.获取品类子节点(平级)
    // /manage/category/get_category.do
    @all('/get_category.do')
    @AuthAdmin()
    @DefaultValue({
        categoryId: 0
    })
    async getChildrenParallerCategory(ctx, next) {
        let categoryId = ctx.body.categoryId
        let result = await categoryService.getChildrenParallerCategory(categoryId)
        ctx.body = result
    }

    //####2.增加节点
    // /manage/category/add_category.do
    @post('/add_category.do')
    @AuthAdmin()
    @Required({
        body: ['categoryName']
    })
    @DefaultValue({
        parentId: 0
    })
    async add_category(ctx, next) {
        let parentId = ctx.body.parentId
        let categoryName = ctx.body.categoryName + ( Math.floor(Math.random()*100) )
        let result = await categoryService.addCategory(parentId, categoryName)
        ctx.body = result
    }

    // ####3.修改品类名字
    // /manage/category/set_category_name.do
    @post('/set_category_name.do')
    @AuthAdmin()
    @Required({
        body: ['categoryId', 'categoryName']
    })
    async set_category_name(ctx, next) {
        let categoryId = ctx.body.categoryId
        let categoryName = ctx.body.categoryName
        let result = await categoryService.updateCategoryName(categoryId, categoryName)
        ctx.body = result
    }

    // ####4.获取当前分类id及递归子节点categoryId
    // /manage/category/get_deep_category.do
    @post('/get_deep_category.do')
    @AuthAdmin()
    @Required({
        body: ['categoryId']
    })
    async getCategoryAndDeepChildrenCategory(ctx, next) {
        let categoryId = ctx.body.categoryId
        let result = await categoryService.selectCategoryAndChildrenById(categoryId)
        ctx.body = result
    }
}