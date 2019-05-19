import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Category = model[Const.Entity.Category]

class CategoryDao {

    async insert(category) {
        return await Category.create(category)
    }

    async selectByPrimaryKey(id) {
        return await Category.findOne({
            where: { id: id }
        })
    }

    async updateByPrimaryKeySelective(category){
        let set = {}
        for (let attr in category) {
            if (category[attr]) {
                set[attr] = category[attr]
            }
        }
        set.update_time = new Date()
        return await Category.update(
            set,
            { where: { id: category.id } }
        )
    }
    async selectCategoryChildrenByParentId(parent_id){
        return await Category.findAll({
            where: { parent_id: parent_id }
        })
    }
}

module.exports = {
    CategoryDao
}