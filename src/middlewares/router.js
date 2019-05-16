const { Route }   = require('../lib/decorator')
const { resolve } = require('path')

export const router = app => {
    let apiPath = resolve(__dirname, '../routes')
    let r = new Route( app,  apiPath)
    r.init()
}