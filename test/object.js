class Person{
    constructor(name){
        this.name = name
    }
    namePerson(){
        console.log('myName: ', this.name);
    }
}

class Tom extends Person{
    constructor(name, color){
        super(name)
        this.color = color
    }
    runTom(){
        console.log('run .. ', this.name, this.color);
    }
    toString(){}
}

let o = new Tom('sb', 'yellow')

// console.log(Object.getPrototypeOf(o));
// console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(o)));
// console.log(Object.isExtensible(o));

// Object.preventExtensions(o);
// Object.seal(o)
// Object.freeze(o)

o.age = 213
o.name = '2b2'
// print(o);

var demo = {
    anme: 'sb',
    pp: 'qwe'
}

// console.log('Object.getPrototypeOf(o) : ', Object.getPrototypeOf(o));

// console.log(o.__proto__);
// console.log(Tom.prototype);

// console.log('Object.getPrototypeOf(o) : ', Object.getPrototypeOf(Object.getPrototypeOf(o)));

print(Object.getOwnPropertyNames(demo))
print(Object.getOwnPropertyNames( Object.getPrototypeOf(Object.getPrototypeOf(o)) ))
print(Object.getOwnPropertyNames( o ))


// print( Object.getOwnPropertyNames(Tom.prototype) )
print( Object.getOwnPropertyNames(o.__proto__) )
print( Object.getOwnPropertyNames(o) )




function print(){
    console.log();
    console.log(...arguments);
}