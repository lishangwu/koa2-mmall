const { Const } = require('../common/Const')

const {
    controller,
    get,
    post,
    Auth,
    Required
} = require('../lib/decorator')

const { UserService } = require('../service/user')
const userService = new UserService()
@controller('/user')
export class userController {

    @post('/login')
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

    @post('/register')
    @Required({
        body: ['username', 'email', 'password']
    })
    async register(ctx, next) {
        let resigterResult = await userService.register(ctx.body)
        ctx.body = resigterResult
    }

}