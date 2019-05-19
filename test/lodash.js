const R = require('lodash')

console.log(R.isEmpty(0))  //true
console.log(R.isEmpty('')) //true
console.log(R.isEmpty([])) //true
console.log(R.isEmpty({})) //true
console.log(R.isEmpty(null)) //true
console.log(R.isEmpty(undefined)) //true

console.log(R.isEmpty(1)); //true

console.log(Date.now());