import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Product = model[Const.Entity.Product]

const _ = require('lodash')

export class ProductDao {

    async selectList(pageNum, pageSize) {
        const options = {
            attributes: {exclude : ['create_time', 'update_time']},
            page: Number(pageNum), // Default 1
            paginate: Number(pageSize), // Default 25
            order: [['id', 'ASC']],
            // where: { name: { [Op.like]: `%elliot%` } }
        }
        const data = await Product.paginate(options)
        const resData = {}
        resData.pageNum = pageNum
        resData.pageSize = pageSize
        resData.total = data.total
        resData.pages = data.pages
        resData.list = data.docs
        return resData
    }

    async selectByNameAndProductId(productName, productId, pageNum, pageSize) {
        const where = {}
        if (productName) {
            where.name = { [Op.like]: `%${productName}%` }
        }
        if (productId) {
            where.id = productId
        }
        const options = {
            attributes: {exclude : ['create_time', 'update_time']},
            page: Number(pageNum), // Default 1
            paginate: Number(pageSize), // Default 25
            order: [['id', 'ASC']],
            // where: { name: { [Op.like]: `%elliot%` } }
            where: where
        }
        const data = await Product.paginate(options)
        const resData = {}
        resData.pageNum = pageNum
        resData.pageSize = pageSize
        resData.total = data.total
        resData.pages = data.pages
        resData.list = data.docs
        return resData
    }

    async selectByPrimaryKey(id) {
        console.log('selectByPrimaryKey: ', id);
        return await Product.findOne({
            where: { id: id }
        })
    }

    async updateByPrimaryKeySelective(product) {
        let set = {}
        for (let attr in product) {
            if (product[attr] !== '') {
                set[attr] = product[attr]
            }
        }
        return await Product.update(
            set,
            { where: { id: product.id } }
        )
    }

    async updateByPrimaryKey(product) {
        let set = {}
        for (let attr in product) {
            if (product[attr]) {
                set[attr] = product[attr]
            }
        }
        set.update_time = new Date()
        return await Product.update(
            set,
            { where: { id: product.id } }
        )
    }

    async insert(product) {
        return await Product.create(product)
    }

    async selectByNameAndCategoryIds(keyword, pageNum, pageSize, categoryIdList, orderByArray) {
        const options = {
            attributes: {exclude : ['create_time', 'update_time']},
            page: Number(pageNum), // Default 1
            paginate: Number(pageSize), // Default 25
            order: [['id', 'ASC']],
            where: {
                status: 1,
                name: { [Op.like]: `%${keyword}%` },
                category_id: categoryIdList
            }
        }

        if (orderByArray.length === 2) {
            options.order = [[orderByArray[0], orderByArray[1]]]
        }

        const data = await Product.paginate(options)
        const resData = {}
        resData.pageNum = pageNum
        resData.pageSize = pageSize
        resData.total = data.total
        resData.pages = data.pages
        resData.list = data.docs
        return resData
    }
}