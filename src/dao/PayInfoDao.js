import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const Pay_info = model[Const.Entity.Pay_info]

class PayInfoDao {

    async insert(info){
        return await Pay_info.create(info)
    }

}

module.exports = {
    PayInfoDao
}