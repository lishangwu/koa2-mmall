const _ = require('lodash')

console.log(_.isEmpty(0))  //true
console.log(_.isEmpty('')) //true
console.log(_.isEmpty([])) //true
console.log(_.isEmpty({})) //true
console.log(_.isEmpty(null)) //true
console.log(_.isEmpty(undefined)) //true

console.log(_.isEmpty(1)); //true

console.log(Date.now());