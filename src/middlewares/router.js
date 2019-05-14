const { Route } = require('../lib/decorator')
const { resolve } = require('path')

// module.exports = function (app) {
//     let apiPath = resolve(__dirname, '../routes')
//     let r = new Route( app,  apiPath)
//     r.init()
// }

export const router = app => {
    let apiPath = resolve(__dirname, '../routes')
    let r = new Route( app,  apiPath)
    r.init()
}