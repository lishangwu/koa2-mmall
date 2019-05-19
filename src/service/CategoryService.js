import { ServerResponse, Const, TokenCache } from '../common'
import { MD5Util, UUID } from '../utils'
import { CategoryDao } from '../dao'

const R = require('ramda')
const _ = require('lodash')

const categoryDao = new CategoryDao()

class CategoryService {

    async addCategory(parentId, categoryName) {
        if (_.isEmpty(parentId) || _.isEmpty(categoryName)) {
            return ServerResponse.createByErrorMessage('添加品类错误')
        }

        let category = {}
        category.name = categoryName
        category.parent_id = parentId
        category.status = true
        let rowResult = await categoryDao.insert(category)
        if(rowResult._options.isNewRecord){
            return ServerResponse.createBySuccess('添加品类成功')
        }
        return ServerResponse.createByErrorMessage('添加品类失败')
    }

    async updateCategoryName(categoryId, categoryName){
        if (_.isEmpty(categoryId) || _.isEmpty(categoryName)) {
            return ServerResponse.createByErrorMessage('更新品类参数错误')
        }
        let category = {}
        category.id = categoryId
        category.name = categoryName
        let updateResult = await categoryDao.updateByPrimaryKeySelective(category)
        console.log('updateResult: ', updateResult)
        if(updateResult > 0){
            return ServerResponse.createBySuccess('更新品类名字成功')
        }
        return ServerResponse.createByErrorMessage('更新品类名字失败')
    }

    //平级，该分类下的一级
    async getChildrenParallerCategory(categoryId) {
        let categoryList = await categoryDao.selectCategoryChildrenByParentId(categoryId);
        if(_.isEmpty(categoryList)){
            console.log('未找到当前分类的子分类')
        }
        return ServerResponse.createBySuccess(categoryList)
    }

    /**
     * 递归查找本节点的id,和孩子节点的id
     * */
    async selectCategoryAndChildrenById(categoryId){
        let categorySet = new Set()
        let categoryList = []
        await this.findChildCategory(categorySet, categoryId)
        if(categoryId != null){
            categorySet.forEach(categoryItem => {
                categoryList.push(categoryItem.id)
            })
        }

        return ServerResponse.createBySuccess(categoryList)

    }

    //递归算法算出子节点
    async findChildCategory(categorySet, categoryId){
        let category = await categoryDao.selectByPrimaryKey(categoryId)
        if(category != null){
            categorySet.add(category)
        }

        //找到该id的所有子id
        let categoryList = await categoryDao.selectCategoryChildrenByParentId(categoryId)
        for(let categoryItem of categoryList){
            await this.findChildCategory(categorySet, categoryItem.id)
        }
        return categorySet

    }

   
}

module.exports = {
    CategoryService
}