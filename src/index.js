const Koa = require('koa')
const app = new Koa()

const {resolve} = require('path')
const R = require('ramda')

const MIDDLEWARES = [
    'common',
    'router'
]

// const useMiddlewares = function(app){
//     MIDDLEWARES.forEach(name => {
//         require( resolve(__dirname, './middlewares', name) )(app)
//     })
// }
const useMiddlewares = app => {
    R.map(
        R.compose(
            R.forEachObjIndexed(initWith => initWith(app)),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}


;(async () => {
    await useMiddlewares(app)
    app.listen(5000, ()=>{
        console.log(`listening port 5000...`);
    })
})();