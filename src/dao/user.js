const model = require('../db/model')
const { Const } = require('../common/Const')
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
        let res = await User.create(user)
        console.log('insert : ', res);
        return res
    }

}

module.exports = {
    UserDao
}