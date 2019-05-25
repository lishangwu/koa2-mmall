 class Test {

    get name(){
        return this._name
    }
    set name(val){
        this._name = val
    }

    toString(){

    }
}

let t = new Test()

t.name = 'sb'
console.log(t.toString());

class A {
    constructor (x) {
        let _x = x
        this.showX = function () {
            return _x
        }
    }
}

let a = new A(1)
// 无法访问
console.log(a._X); 		// undefined
// 可以访问
console.log(a.showX())

console.log(Reflect.ownKeys(a));
console.log(Reflect.ownKeys(A));
console.log(Reflect.ownKeys(t));