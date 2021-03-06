import { Const } from '../common'
import { sequelize, Sequelize } from '../db/db'

const Op = Sequelize.Op
const model = require('../db/model')
const User = model[Const.Entity.User]

class UserDao {

    async checkUsername(username) {
        return await User.count({
            where: [{ username: username }]
        })
    }

    async checkEmail(email) {
        return await User.count({
            where: [{ email: email }]
        })
    }

    async selectLogin(username, password) {
        return await User.findOne({
            where: { username: username, password: password }
        })
    }

    async insert(user) {
        return await User.create(user)
    }

    async selectByPrimaryKey(id) {
        return await User.findOne({
            where: { id: id }
        })
    }

    async updateByPrimaryKeySelective(user) {
        let set = {}
        for (let attr in user) {
            if (user[attr] !== '') {
                set[attr] = user[attr]
            }
        }
        return await User.update(
            set,
            { where: { id: user.id } }
        )
    }

    async updateByPrimaryKey() {

    }

    async selectQuestionByUsername(username) {
        return await User.findOne({
            attributes: ['question'],
            where: { username: username }
        })
    }

    async checkAnswer(username, question, answer) {
        return await User.count({
            where: [{ username: username, question: question, answer: answer }]
        })
    }

    async updatePasswordByUsername(username, passwordNew) {
        return await User.update(
            { password: passwordNew, update_time: new Date },
            { where: { username: username } }
        )
    }

    async checkPassword(password, userid) {
        return await User.count({
            where: [{ password: password, id: userid }]
        })
    }

    async checkEmailByUserId(email, userid) {
        return await User.count({
            where: [{ email: email, id: { [Op.ne]: userid } }]
        })
    }
}

module.exports = {
    UserDao
}