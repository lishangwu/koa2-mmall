class Person{
    constructor(name){
        this.name = name
    }
    myName(){
        console.log('myName: ', this.name);
    }
}

class Tom extends Person{
    constructor(name, color){
        super(name)
        this.color = color
    }
    run(){
        console.log('run .. ', this.name, this.color);
    }
}

let t = new Tom('sb', 'yellow')
// t.run()

console.log(Object.getPrototypeOf(t));
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(t)));