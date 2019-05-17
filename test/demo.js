const R = require('ramda')

console.log( R.equals({})({}) );

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

for(let o in obj){
    console.log(o, obj[o])
}


if(''){
    console.log('sb')
}else{
    console.log('sb2')
}

