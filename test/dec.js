@controller('en')
class Boy {
    @speak('zh')
    run() {
        console.log('run..' + this.language);
    }
}

// controller1: function Boy() {
//     (0, _classCallCheck3.default)(this, Boy);
// }
// controller2: undefined
// controller3: undefined
function controller(language) {
    return function (target) {
        console.log('controller1:', target);
        target.prototype.language = language
    }
}

// speak1: Boy {}
// speak2: run
// speak3: { value: [Function: run],
//   writable: true,
//   enumerable: false,
//   configurable: true }
function speak(language) {
    return function (target, key, descriptor) {
        // console.log('speak1:', target);
        // console.log('speak2:', key);
        // console.log('speak3:', descriptor);
        console.log(target[key]);//[Function: run]
        target.language = language
        return descriptor
    }
}

const luck = new Boy()
luck.run()