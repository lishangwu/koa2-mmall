const numeral = require('numeral')

// let p = numeral(0)

// console.log(p.add(1).add(2));
// console.log(p.value());

let p = numeral(0)
for(let n of [1,2,3,4,5]){
    p.add(n)
}

console.log(p);