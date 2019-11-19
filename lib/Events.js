"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Events = function () {
    function Events(ctx) {
        (0, _classCallCheck3.default)(this, Events);

        this._events = {};
        this._ctx = ctx;
    }

    (0, _createClass3.default)(Events, [{
        key: "_getHandlersForType",
        value: function _getHandlersForType(type) {
            if (!(type in this._events)) {
                this._events[type] = [];
            }
            return this._events[type];
        }
    }, {
        key: "on",
        value: function on(type, handler) {
            var handlers = this._getHandlersForType(type);
            handlers.push(handler);
        }
    }, {
        key: "off",
        value: function off(type, handler) {
            if (handler != null) {
                var handlers = this._getHandlersForType(type);
                (0, _utils.removeFromArray)(handlers, handler);
            } else {
                delete this._events[type];
            }
        }
    }, {
        key: "trigger",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(type) {
                var _this = this;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                var handlers, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

                return _regenerator2.default.wrap(function _callee2$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                handlers = this._getHandlersForType(type).slice();
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context3.prev = 4;
                                _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
                                    var handler, result;
                                    return _regenerator2.default.wrap(function _loop$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    handler = _step.value;
                                                    _context2.next = 3;
                                                    return new _promise2.default(function () {
                                                        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                                                            var isAsync, handlerResult;
                                                            return _regenerator2.default.wrap(function _callee$(_context) {
                                                                while (1) {
                                                                    switch (_context.prev = _context.next) {
                                                                        case 0:
                                                                            _context.prev = 0;
                                                                            isAsync = false;


                                                                            _this._ctx.async = function () {
                                                                                isAsync = true;
                                                                                return function () {
                                                                                    var continueLoop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                                                                                    resolve(continueLoop);
                                                                                };
                                                                            };

                                                                            _context.next = 5;
                                                                            return _promise2.default.resolve(handler.call.apply(handler, [_this._ctx].concat(args)));

                                                                        case 5:
                                                                            handlerResult = _context.sent;


                                                                            delete _this._ctx.async;

                                                                            if (isAsync) {
                                                                                // We don't resolve the promise now, but wait til the
                                                                                // thing above is called.
                                                                            } else {
                                                                                resolve(handlerResult);
                                                                            }

                                                                            _context.next = 13;
                                                                            break;

                                                                        case 10:
                                                                            _context.prev = 10;
                                                                            _context.t0 = _context["catch"](0);


                                                                            reject(_context.t0);

                                                                        case 13:
                                                                        case "end":
                                                                            return _context.stop();
                                                                    }
                                                                }
                                                            }, _callee, _this, [[0, 10]]);
                                                        }));

                                                        return function (_x2, _x3) {
                                                            return _ref2.apply(this, arguments);
                                                        };
                                                    }());

                                                case 3:
                                                    result = _context2.sent;

                                                    if (!(typeof result !== "undefined" && !result)) {
                                                        _context2.next = 6;
                                                        break;
                                                    }

                                                    return _context2.abrupt("return", "break");

                                                case 6:
                                                case "end":
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _loop, _this);
                                });
                                _iterator = (0, _getIterator3.default)(handlers);

                            case 7:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context3.next = 15;
                                    break;
                                }

                                return _context3.delegateYield(_loop(), "t0", 9);

                            case 9:
                                _ret = _context3.t0;

                                if (!(_ret === "break")) {
                                    _context3.next = 12;
                                    break;
                                }

                                return _context3.abrupt("break", 15);

                            case 12:
                                _iteratorNormalCompletion = true;
                                _context3.next = 7;
                                break;

                            case 15:
                                _context3.next = 21;
                                break;

                            case 17:
                                _context3.prev = 17;
                                _context3.t1 = _context3["catch"](4);
                                _didIteratorError = true;
                                _iteratorError = _context3.t1;

                            case 21:
                                _context3.prev = 21;
                                _context3.prev = 22;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 24:
                                _context3.prev = 24;

                                if (!_didIteratorError) {
                                    _context3.next = 27;
                                    break;
                                }

                                throw _iteratorError;

                            case 27:
                                return _context3.finish(24);

                            case 28:
                                return _context3.finish(21);

                            case 29:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee2, this, [[4, 17, 21, 29], [22,, 24, 28]]);
            }));

            function trigger(_x) {
                return _ref.apply(this, arguments);
            }

            return trigger;
        }()
    }]);
    return Events;
}();

exports.default = Events;