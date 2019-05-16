const Sequelize = require('sequelize')
require('sequelize-values')(Sequelize);
const config = require('../config/mysql/index')

console.log(`init sequelize...`);

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host   : config.host,
    dialect: config.dialect,
    pool   : {
        max : 5,
        min : 0,
        idle: 10000
    },
    define: {
        charset   : 'utf8',
        collate   : 'utf8_general_ci',
        timestamps: false,
    },
    logging: false,

})

module.exports = {
    sequelize, Sequelize
}