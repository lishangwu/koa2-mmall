const bodyParser = require('koa-bodyparser')
const logger     = require('koa-logger')
const session    = require('koa-session')
const R          = require('ramda')
const Const      = require('../common/Const')

export const addBodyParses = app => {
    app.use(bodyParser())
}

export const addLogger = app => {
    app.use(logger())
}

export const addSession = app => {
    app.keys = ['trailer']
    const CONFIG = {
        key      : 'koa:sess',
        maxAge   : 86400,
        overwrite: true,
        httpOnly : false,
        signed   : true,
        rolling  : false
    }
    app.use(session(CONFIG, app))
}

export const addLogger2 = app => {
    app.use(async(ctx, next)=>{
        console.log('------------>  url : ', ctx.url);
        if(!R.equals(ctx.request.body)({})){
            console.log('------------>  body : ', ctx.request.body);
        }
        if(!R.equals(ctx.request.query)({})){
            console.log('------------>  query : ', ctx.request.query);
        }
        await next()
        console.log('<<===========  ctx.body : ', JSON.stringify(ctx.body));
        if(ctx.session[Const.CURRENT_USER]){
            console.log('<<===========  session : ', ctx.session[Const.CURRENT_USER].username);
        }
    })
}