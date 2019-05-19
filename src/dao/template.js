import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const User = model[Const.Entity.Category]

class UserDao {

    async checkUsername(username) {
        return await User.count({
            where: [{ username: username }]
        })
    }
}

module.exports = {
    UserDao
}