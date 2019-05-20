import { ServerResponse, Const, TokenCache } from '../common'
import { MD5Util, UUID } from '../utils'
import { ProductDao, CategoryDao } from '../dao'
import { CategoryService } from  './CategoryService'

const R = require('ramda')
const _ = require('lodash')
const productDao = new ProductDao()
const categoryDao = new CategoryDao()
const categoryService = new CategoryService()

export class ProductService {

    async getProductList(pageNum,pageSize){
        let result  =await productDao.selectList(pageNum,pageSize)
        if(result.docs === 0){
            console.log('getProductList: ', result)
        }
        return ServerResponse.createBySuccess(result)
    }

    async searchProduct(productName,productId,pageNum,pageSize){
        let result  =await productDao.selectByNameAndProductId(productName,productId,pageNum,pageSize);
        if(result.docs === 0){
            console.log('getProductList: ', result)
        }
        return ServerResponse.createBySuccess(result)
    }

    async manageProductDetail(productId){
        let result = await productDao.selectByPrimaryKey(productId)
        if(result != null){
            return ServerResponse.createBySuccess(result)
        }
        return ServerResponse.createByErrorMessage('产品已下架或者删除')
    }

    async setSaleStatus(productId, status){
        let product = {}
        product.id = productId
        product.status = status
        let updateCount = await productDao.updateByPrimaryKeySelective(product)
        if (updateCount > 0) {
            return ServerResponse.createBySuccess('修改产品销售状态成功')
        }
        return ServerResponse.createByErrorMessage('修改产品销售状态失败')
    }

    async saveOrUpdateProduct(product){
        product.subImages = product.subImages
        product.category_id = product.categoryId
        if(product != null){
            if(!R.isEmpty(product.subImages)){
                let subImageArray = product.subImages.split(",");
                if(subImageArray.length > 0){
                    product.main_image = subImageArray[0]
                }
            }
        }
        if(!_.isEmpty(product.id)){
            //update
            let updateCount = await productDao.updateByPrimaryKey(product)
            if(updateCount > 0){
                return ServerResponse.createBySuccess('更新产品成功')
            }else{
                return ServerResponse.createByErrorMessage('更新产品失败')
            }
        }else{
            //save
            let rowResult = await  productDao.insert(product)
            if(rowResult._options.isNewRecord){
                return ServerResponse.createBySuccess('新增产品成功')
            }else{
                return ServerResponse.createByErrorMessage('新增产品失败')
            }
        }

        return ServerResponse.createByErrorMessage("新增或更新产品参数不正确")
    }

    async getProductDetail(productId){
        let result = await productDao.selectByPrimaryKey(productId)
        if(result != null){
            return ServerResponse.createBySuccess(result)
        }
        return ServerResponse.createByErrorMessage('产品已下架或者删除')
    }

    async getProductByKeywordCategory(keyword,categoryId,pageNum,pageSize,orderBy){
        let category = await categoryDao.selectByPrimaryKey(categoryId);

        if(category == null){
            return ServerResponse.createBySuccess({})
        }

        let categoryIdList = ( await categoryService.selectCategoryAndChildrenById(category.id) ).data

        let orderByArray = []
        if(orderBy){
            if(Const.PRICE_ASC_DESC().has(orderBy)){
                orderByArray = orderBy.split("_");
            }
        }

        let productList = await productDao.selectByNameAndCategoryIds(keyword,pageNum,pageSize, categoryIdList, orderByArray)
        return ServerResponse.createBySuccess(productList)
    }
}