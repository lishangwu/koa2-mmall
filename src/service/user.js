const { UserDao }        = require('../dao/user')
const userDao            = new UserDao()
const { ServerResponse } = require('../common/ServerResponse')
const { md5 }            = require('../utils/crpy')
const { Const }          = require('../common/Const')

class UserService {
    constructor() {
        this.userDao = new UserDao()
    }

    async login(username, password) {
        let resultCount = await userDao.checkUsername(username)
        if (resultCount === 0) {
            return ServerResponse.createByErrorMessage('用户名不存在')
        }
        //TODO password md5
        // password = md5(password)
        let user = await userDao.selectLogin(username, password)
        if (!user) {
            return ServerResponse.createByErrorMessage('密码错误')
        }
        user.password = ''
        return ServerResponse.createBySuccessMessageData("登录成功", user.getValues())
    }

    async register(user) {
        let vaildResponse = await this.checkValid(user.username, Const.USERNAME)

        if (!vaildResponse.isSuccess()) {
            return vaildResponse
        }
        vaildResponse = await this.checkValid(user.email, Const.EMAIL)
        if (!vaildResponse.isSuccess()) {
            return vaildResponse
        }

        user.role = Const.Role.ROLE_CUSTOMER

        // user.password = md5(user.password)

        let resultCount = await userDao.insert(user)
        if (resultCount === 0) {
            return ServerResponse.createByErrorMessage("注册失败")
        }

        return ServerResponse.createBySuccessMessage("注册成功")

    }

    async checkValid(str, type) {
        if (typeof type === 'string') {
            if (Const.USERNAME === type) {
                let resultCount = await userDao.checkUsername(str)
                if (resultCount > 0) {
                    return ServerResponse.createByErrorMessage("用户名已存在")
                }
            } else if (Const.EMAIL === type) {
                let resultCount = await userDao.checkEmail(str)
                if (resultCount > 0) {
                    return ServerResponse.createByErrorMessage("email已经存在")
                }
            }
        } else {
            return ServerResponse.createByErrorMessage("参数错误")
        }

        return ServerResponse.createBySuccessMessage("校验成功")
    }
}

module.exports = {
    UserService
}