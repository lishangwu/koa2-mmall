const { ServerResponse } = require('../common/ServerResponse')

const { Const } = require('../common/Const')

const {
    controller,
    get,
    post,
    all,
    Auth,
    Required
} = require('../lib/decorator')

const { UserService } = require('../service/user')
const userService = new UserService()
@controller('/user')
export class userController {

    //####1.登录
    // /user/login.do
    @post('/login.do')
    @Required({
        body: ['username', 'password']
    })
    async login(ctx, next) {
        let loginResponse = await userService.login(ctx.body.username, ctx.body.password)
        if (loginResponse.isSuccess()) {
            // set session ..
            ctx.session[Const.CURRENT_USER] = loginResponse.data
        }
        ctx.body = loginResponse
    }

    //####2.注册 /user/register.do
    @post('/register.do')
    @Required({
        body: ['username','password','email','phone','question','answer']
    })
    async register(ctx, next) {
        let resigterResult = await userService.register(ctx.body)
        ctx.body = resigterResult
    }

    //####3.检查用户名是否有效
    @post('/check_valid.do')
    @Required({
        body: ['str','type']
    })
    async check_valid(ctx, next) {
        let checkResult = await userService.checkValid(ctx.body.str, ctx.body.type)
        ctx.body = checkResult
    }

    //####4.获取登录用户信息 /user/get_user_info.do
    @all('/get_user_info.do')
    async get_user_info(ctx, next){
        let user = ctx.session[Const.CURRENT_USER]
        if(user){
            return ctx.body = ServerResponse.createBySuccess(user)
        }
        ctx.body = ServerResponse.createByErrorMessage('用户未登录,无法获取当前用户信息')
    }

    //####5.忘记密码 /user/forget_get_question.do
    @post('/forget_get_question.do')
    @Required({
        body: ['username']
    })
    async forget_get_question(ctx, next){
        let result = await userService.selectQuestion(ctx.body.username)
        ctx.body = result
    }

    //####6.提交问题答案 /user/forget_check_answer.do
    //正确的返回值里面有一个token，修改密码的时候需要用这个。传递给下一个接口
    @post('/forget_check_answer.do')
    @Required({
        body: ['username','question','answer']
    })
    async forget_check_answer(ctx, next){
        let result = await userService.checkAnswer(ctx.body.username, ctx.body.question, ctx.body.answer )
        ctx.body = result
    }

    //####7.忘记密码的重设密码 /user/forget_reset_password.do
    @post('/forget_reset_password.do')
    @Required({
        body: ['username','passwordNew','forgetToken']
    })
    async forget_reset_password(ctx, next){
        let result = await userService.forgetResetPassword(ctx.body.username, ctx.body.passwordNew, ctx.body.forgetToken )
        ctx.body = result
    }

    //####8.登录中状态重置密码 /user/reset_password.do
    @post('/reset_password.do')
    @Auth()
    @Required({
        body: ['passwordOld','passwordNew']
    })
    async reset_password(ctx, next){
        let result = await userService.resetPassword(ctx.body.passwordOld, ctx.body.passwordNew, ctx.session[Const.CURRENT_USER] )
        ctx.body = result
    }

    //####9.登录状态更新个人信息 /user/update_information.do
    @post('/update_information.do')
    @Auth()
    @Required({
        body: ['email','phone','question','answer']
    })
    async update_information(ctx, next){
        let user = ctx.session[Const.CURRENT_USER]
        let { email, phone, question, answer } = ctx.body
        let updateUser = { email, phone, question, answer }
        let result = await userService.updateInformation(updateUser,user)
        ctx.body = result
    }

    //####10.获取当前登录用户的详细信息，并强制登录 /user/get_information.do
    @post('/get_information.do')
    @Auth()
    async get_information(ctx, next){
        ctx.body = await userService.getInformation(ctx.session[Const.CURRENT_USER].id)
    }

    //####11.退出登录 /user/logout.do
    @post('/logout.do')
    async logout(ctx, next) {
        ctx.session[Const.CURRENT_USER] = null
        ctx.body = ServerResponse.createBySuccess()
    }

}