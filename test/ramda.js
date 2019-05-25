const R = require('ramda')

// console.log( R.equals({})({}) );

var obj = { id: 36,
    username: 'aa',
    password: 'qq',
    email: 'aa@happymmall.com',
    phone: '13800013800',
    question: 'sb',
    answer: 'sb',
    role: 0,
    create_time: '2019-05-16T15:05:59.000Z',
    update_time: '2019-05-17T10:00:42.000Z'
}
console.log(R.isEmpty(0)) //false

console.log(R.isEmpty('')) //true
console.log(R.isEmpty([])) //true
console.log(R.isEmpty({})) //true

console.log(R.isEmpty(null)) //false
console.log(R.isEmpty(undefined)) //false

console.log(R.isEmpty(123)); // false