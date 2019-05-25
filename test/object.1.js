let obj = Object.defineProperty({}, "x", {
    value: 1, //值
    writable: true,
    enumerable: true,
    configurable: true
})
console.log(obj);
let obj2 = {}
Object.defineProperties(obj2, {
    x1: { value: 1, writable: true, enumerable: false, configurable: true },
    x2: { value: 2, writable: true, enumerable: true, configurable: true },
    r3: {
        get: function () { return Math.max(this.x, this.y) },
        enumerable: true,
        configurable: true
    }
})

console.log(obj2);

// delete obj2.x1

console.log(Object.keys(obj2));
console.log(Object.getOwnPropertyNames(obj2))

for(let o in obj2){
    console.log(o);
}