const defaultConfig = './default.js'
const overrideConfig = './override.js'
const testConfig = './test.js'
const productionConfig = './production.js'

const fs = require('fs')
var config = null

if(process.env.NODE_ENV === 'test'){
    console.log(`Load config ${testConfig}...`);
    config = require(testConfig)
}else if(process.env.NODE_ENV === 'production'){
    config = require(productionConfig)
}else{
    console.log(`Load config ${defaultConfig}...`);
    config = require(defaultConfig)
    try{
        if(fs.statSync(overrideConfig).isFile()){
            config = Object.assign(config, require(overrideConfig))
        }
    }catch(e){
        console.log(`Cannot load ${overrideConfig}.`);
    }
}

module.exports = config