import { ServerResponse, Const, TokenCache } from '../common'
import { MD5Util, UUID } from '../utils'
import { CategoryDao } from '../dao'

const R = require('ramda')
const categoryDao = new CategoryDao()

class CategoryService {

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
        return ServerResponse.createBySuccess("登录成功", user.getValues())
    }

   
}

module.exports = {
    CategoryService
}