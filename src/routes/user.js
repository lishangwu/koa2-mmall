const { 
    controller, 
    get,
    post,
    Auth ,
    Required
} = require('../lib/decorator')

@controller('/user')
export class userController {

    //不要少了()
    @get('/login')
    @Auth()
    @Required({
        query: ['email', 'password']
    })
    async login(ctx, next) {
        ctx.body = {
            name: 'login', pwd: 'qwe'
        }
    }

    @post('/register')
    @Auth()
    @Required({
        body: ['username', 'password']
    })
    async register(ctx, next) {
        ctx.body = {
            name: 'register', pwd: 'qwe'
        }
    }

}