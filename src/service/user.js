const { UserDao } = require('../dao/user')
const userDao = new UserDao()
const { ServerResponse } = require('../common/ServerResponse')
const { MD5Util } = require('../utils/MD5Util')
const { Const } = require('../common/Const')
const { TokenCache } = require('../common/TokenCache')
const {UUID} = require('../utils/UUID')
const R = require('ramda')

class UserService {

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

    async selectQuestion(username) {
        console.log('selectQuestion: ...',username)

        let vaildResponse = await this.checkValid(username, Const.USERNAME)

        if (vaildResponse.isSuccess()) {
            return ServerResponse.createByErrorMessage("用户名不存在")
        }

        let result = await userDao.selectQuestionByUsername(username)
        if(!result.question){
            return ServerResponse.createByErrorMessage('该用户未设置找回密码问题')
        }
        return ServerResponse.createBySuccess(result.question)
    }

    async checkAnswer(username,question,answer){
        let resultCount = await userDao.checkAnswer(username, question, answer);
        if(resultCount > 0){
            let forgetToken = UUID.randomUUID()
            TokenCache.setKey(TokenCache.TOKEN_PREFIX + username, forgetToken)
            return ServerResponse.createBySuccess(forgetToken)
        }
        return ServerResponse.createByErrorMessage("问题的答案错误")
    }

    async forgetResetPassword(username,passwordNew,forgetToken){
        if(!forgetToken){
            return ServerResponse.createByErrorCodeMessage('参数错误,token需要传递')
        }

        let vaildResponse = await this.checkValid(username, Const.USERNAME)
        if (vaildResponse.isSuccess()) {
            return ServerResponse.createByErrorMessage("用户名不存在")
        }

        let token = TokenCache.getKey(TokenCache.TOKEN_PREFIX + username);
        if(!token){
            return ServerResponse.createByErrorMessage("token无效或者过期")
        }

        if(R.equals(token)(forgetToken)){

            // passwordNew = MD5Util.md5(passwordNew)
            let resultCount = 0
            resultCount = await userDao.updatePasswordByUsername(username, passwordNew)
            if(resultCount > 0){
                return ServerResponse.createBySuccessMessage('修改密码成功')
            }

        }else{
            return ServerResponse.createByErrorMessage("token错误,请重新获取重置密码的token")
        }
        return ServerResponse.createByErrorMessage("修改密码失败")

    }

    async resetPassword(passwordOld,passwordNew,user){
        //防止横向越权,要校验一下旧的密码,一定要指定是这个用户,因为我们会查询一个count(1),如果不指定id,那么结果就是true,count>0;
        // passwordOld = MD5Util.md5(passwordOld)
        let resultCount = userDao.checkPassword(passwordOld, user.id)
        if(resultCount === 0){
            return ServerResponse.createByErrorMessage('旧密码错误')
        }
        // passwordNew = MD5Util.md5(passwordNew)
        user.password = passwordNew
        let updateCount = await userDao.updateByPrimaryKeySelective(user)
        if(updateCount > 0){
            return ServerResponse.createBySuccessMessage('密码更新成功')
        }
        return ServerResponse.createByErrorMessage('密码更新失败')
    }

    async updateInformation(updateUser, user){
        //username不能被更新
        //email进行校验,校验新的email是不是已经存在,并且存在的email如果相同的话,不能是我们当前的这个用户的
        let resultcount = await userDao.checkEmailByUserId(updateUser.email, user.id)
        if(resultcount > 0){
            return ServerResponse.createByErrorMessage('email已经存在,请更换email再尝试更新')
        }
        for(let attr in updateUser){
            user[attr] = updateUser[attr]
        }
        let updateCount = await userDao.updateByPrimaryKeySelective(user)
        if(updateCount > 0){
            return ServerResponse.createBySuccess('更新个人信息成功', user)
        }
        return ServerResponse.createByErrorMessage('更新个人信息失败')
    }

    async getInformation(userid){
        let user = await userDao.selectByPrimaryKey(userid)
        if(!user){
            return ServerResponse.createByErrorMessage('找不到当前用户')
        }
        user.password = ''
        return ServerResponse.createBySuccess(user)
    }
}

module.exports = {
    UserService
}