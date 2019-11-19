'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isFunction = isFunction;
exports.nextUpdate = nextUpdate;
exports.isObject = isObject;
exports.removeFromArray = removeFromArray;
function isFunction(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]';
}

function nextUpdate(predicate) {
    return setTimeout(predicate, 0);
}

function isObject(obj) {
    return obj != null && obj === Object(obj);
}

function removeFromArray(array, item) {
    var again = true;
    while (again) {
        var index = array.indexOf(item);
        if (index != -1) {
            array.splice(index, 1);
        } else {
            again = false;
        }
    }
}