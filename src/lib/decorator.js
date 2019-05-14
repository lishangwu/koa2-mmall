const Router = require('koa-router')
const { resolve } = require('path')
const symbolPrefix = Symbol('prefix')

const glob = require('glob')
const R = require('ramda')

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
            const prefixPath = conf.target['prefixPath']
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

function normalizePath(path) {
    return path.startsWith('/') ? path : `/${path}`
}

export const controller = function (path) {
    return function (tartget) {
        tartget.prototype['prefixPath'] = path
    }
}

export const get = function (path) {
    const conf = {
        method: 'get',
        path: normalizePath(path)
    }
    return function (target, key, descriptor) {
        const k = {
            target: target,
            ...conf
        }
        const v = target[key]
        routerMap.set(k, v)
    }
}
export const post = function (path) {
    const conf = {
        method: 'post',
        path: normalizePath(path)
    }
    return function (target, key, descriptor) {
        const k = {
            target: target,
            ...conf
        }
        const v = target[key]
        routerMap.set(k, v)
    }
}

const changeToArr = R.unless(R.is(Array), R.of)
//compose：将多个函数合并成一个函数，从右到左执行。
//concat：将两个数组合并成一个数组。
export const Auth = function () {
    const middleware = async (ctx, next) => {
        console.log('Auth :登陆信息已失效, 请重新登陆')
        await next()
    }
    return function (target, key, descriptor) {
        target[key] = R.compose(
            R.concat(changeToArr(middleware)),
            changeToArr
        )(target[key])
        return descriptor
    }
}

export const Required = function(rules){
    const middleware = async(ctx, next) => {
        
        let errors = []
        R.forEachObjIndexed(
            (value, key) => {
                errors = R.filter( i => !R.has(i,  ctx.request[key]) )(value)
            }
        )(rules)

        if(errors.length){
            return ctx.body = {
                success:false,
                code: 412,
                err: `${errors.join(',')} is required`
            }
        }

        await next()
    }
    return function(target, key, descriptor){
        target[key] = R.compose(R.concat(changeToArr(middleware)) ,changeToArr)(target[key])
    }
}