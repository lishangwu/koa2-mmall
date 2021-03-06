const fs   = require('fs')
const path = require('path')
const db   = require('./db')
const sequelizePaginate = require('sequelize-paginate')

let files    = fs.readdirSync(path.resolve(__dirname, './models'));
let js_files = files.filter(f => {
    return f.endsWith('.js')
}, files)

for (let f of js_files) {
    console.log(`import model from files ${f}...`);
    let name = f.substring(0, f.length - 3)
    const MyModel = db.sequelize.import(path.resolve(__dirname, './models', f))
    MyModel.beforeValidate((obj, options) => {
        let now = new Date()
        if (obj.isNewRecord) {
            console.log('will create entity...');
            obj.create_time = now
            obj.update_time = now
        } else {
            console.log('will update entity...');
            obj.update_time = now
        }
    });
    sequelizePaginate.paginate(MyModel)
    module.exports[name] = MyModel
}