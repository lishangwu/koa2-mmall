const Router = require('koa-router')
const { resolve } = require('path')
const symbolPrefix = Symbol('prefix')
const glob = require('glob')
const R = require('ramda')

import { ServerResponse } from '../common/ServerResponse'
import { Const } from '../common/Const'
import { ResponseCode } from '../common/ResponseCode'

import { UserService } from '../service';
const userService = new UserService()

const routerMap = new Map()
function isArray(c) {
    return c instanceof Array ? c : [c]
}

export class Route {
    constructor(app, apiPath) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }
    init() {
        glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller)
            let prefixPath = conf.target['prefixPath']
            if (prefixPath) {
                prefixPath = normalizePath(prefixPath)
            }
            const routerPath = prefixPath + conf.path
            this.router[conf.method](routerPath, ...controllers)
        }

        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

export const controller = path => target => target.prototype['prefixPath'] = path

const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)
    const k = {
        target: target,
        ...conf
    }
    const v = target[key]
    routerMap.set(k, v)
}

export const all = path => router({ method: 'all', path: path })
export const get = path => router({ method: 'get', path: path })
export const post = path => router({ method: 'post', path: path })
export const put = path => router({ method: 'put', path: path })
export const Delete = path => router({ method: 'Delete', path: path })


const changeToArr = R.unless(
    R.is(Array),
    R.of
)
//compose：将多个函数合并成一个函数，从右到左执行。
//concat：将两个数组合并成一个数组。

const convert = middleware => (target, key, descriptor) => {
    target[key] = R.compose(
        R.concat(changeToArr(middleware)),
        changeToArr
    )(target[key])
    return descriptor
}

export const Auth = () => convert(async (ctx, next) => {
    if (!ctx.session[Const.CURRENT_USER]) {
        return ctx.body = ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.code, '用户未登录,无法获取当前用户信息,status=10,强制登录')
    }
    await next()
})

export const AuthAdmin = () => convert(async (ctx, next) => {
    if (!ctx.session[Const.CURRENT_USER]) {
        return ctx.body = ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.code, '用户未登录,无法获取当前用户信息,status=10,强制登录2')
    }
    //是否是管理员
    if (!userService.checkAdminRole(ctx.session[Const.CURRENT_USER]).isSuccess()) {
        return ctx.body = ServerResponse.createByErrorCodeMessage(ResponseCode.NEED_LOGIN.code, '无权限操作,需要管理员权限')
    }
    await next()
})

export const Required = rules => convert(async (ctx, next) => {
    let errors = []
    R.forEachObjIndexed(
        (value, key) => {
            errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
        }
    )(rules)

    if (errors.length) {
        return ctx.body = ServerResponse.createByErrorCodeMessage(ResponseCode.ILLEGAL_ARGUMENT.code, `[ ${errors.join(', ')} ] is required`)
    }

    ctx.body = ctx.request.body || {}
    ctx.query = ctx.request.query || {}
    await next()
})

/*
* DefaultValue : {
*   categoryId : 0
* }
* */
export const DefaultValue = rules => convert(async (ctx, next) => {

    ctx.query = {}
    ctx.body = {}
    for (let key in rules) {
        if (ctx.method === 'GET') {
            if (!ctx.request.query[key]) {
                ctx.query[key] = rules[key]
                ctx.body[key] = rules[key]
            }
        }
        if (ctx.method === 'POST') {
            if (!ctx.request.body[key]) {
                ctx.query[key] = rules[key]
                ctx.body[key] = rules[key]
            }
        }
    }
    await next()
})

let logTimes = 0
export const Log = () => convert(async (ctx, next) => {
    logTimes++
    console.time(`${logTimes}: ${ctx.method} - ${ctx.url}`)
    await next()
    console.timeEnd(`${logTimes}: ${ctx.method} - ${ctx.url}`)
})