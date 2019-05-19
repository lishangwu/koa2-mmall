import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Product = model[Const.Entity.Product]

const _ = require('lodash')

export class ProductDao {

    async selectList(pageNum,pageSize){
        const options = {
            // attributes: ['id', 'name'],
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

    async selectByNameAndProductId(productName,productId,pageNum,pageSize){
        const where = {}
        if(productName){
            where.name = { [Op.like]: `%${productName}%` }
        }
        if(productId){
            where.id = productId
        }
        const options = {
            // attributes: ['id', 'name'],
            page: Number(pageNum), // Default 1
            paginate: Number(pageSize), // Default 25
            order: [['id', 'ASC']],
            // where: { name: { [Op.like]: `%elliot%` } }
            where:where
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

    async selectByPrimaryKey(id){
        return await Product.findOne({
            where: {id: id}
        })
    }

    async updateByPrimaryKeySelective(product){
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

    async updateByPrimaryKey(product){
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
}