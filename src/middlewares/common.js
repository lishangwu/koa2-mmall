const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')

// module.exports = app => {
//     app.use(bodyParser())
// }

export const addBodyParses = app => {
    app.use(bodyParser())
}

export const addLogger = app => {
    app.use(logger())
}

export const addSession = app => {
    app.keys = ['trailer']
    const CONFIG = {
        key: 'koa:sess',
        maxAge: 86400,
        overwrite: true,
        httpOnly: false,
        signed: true,
        rolling: false
    }

    app.use(session(CONFIG, app))
}