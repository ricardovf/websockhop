"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JsonFormatter = exports.StringFormatter = exports.MessageFormatterBase = undefined;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageFormatterBase = exports.MessageFormatterBase = function () {
    function MessageFormatterBase() {
        (0, _classCallCheck3.default)(this, MessageFormatterBase);
    }

    (0, _createClass3.default)(MessageFormatterBase, [{
        key: "toMessage",
        value: function toMessage(obj) {
            throw "Not Implemented";
        }
    }, {
        key: "fromMessage",
        value: function fromMessage(message) {
            throw "Not Implemented";
        }
    }, {
        key: "trackRequest",
        value: function trackRequest(requestObject, handler) {
            throw "Not Implemented";
        }
    }, {
        key: "getHandlerForResponse",
        value: function getHandlerForResponse(responseObject) {
            return null;
        }
    }, {
        key: "getPendingHandlerIds",
        value: function getPendingHandlerIds() {
            return null;
        }
    }]);
    return MessageFormatterBase;
}();

(0, _assign2.default)(MessageFormatterBase.prototype, {
    pingMessage: null,
    pingRequest: null,
    handlePing: null,
    handlePong: null
});

var StringFormatter = exports.StringFormatter = function (_MessageFormatterBase) {
    (0, _inherits3.default)(StringFormatter, _MessageFormatterBase);

    function StringFormatter() {
        (0, _classCallCheck3.default)(this, StringFormatter);
        return (0, _possibleConstructorReturn3.default)(this, (StringFormatter.__proto__ || (0, _getPrototypeOf2.default)(StringFormatter)).apply(this, arguments));
    }

    (0, _createClass3.default)(StringFormatter, [{
        key: "toMessage",
        value: function toMessage(obj) {
            return obj.toString();
        }
    }, {
        key: "fromMessage",
        value: function fromMessage(message) {
            return message;
        }
    }]);
    return StringFormatter;
}(MessageFormatterBase);

var JsonFormatter = exports.JsonFormatter = function (_MessageFormatterBase2) {
    (0, _inherits3.default)(JsonFormatter, _MessageFormatterBase2);

    function JsonFormatter() {
        (0, _classCallCheck3.default)(this, JsonFormatter);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (JsonFormatter.__proto__ || (0, _getPrototypeOf2.default)(JsonFormatter)).call(this));

        _this2._requestMap = new _map2.default();
        _this2._nextId = 0;
        return _this2;
    }

    (0, _createClass3.default)(JsonFormatter, [{
        key: "toMessage",
        value: function toMessage(obj) {
            return (0, _stringify2.default)(obj);
        }
    }, {
        key: "fromMessage",
        value: function fromMessage(message) {
            return JSON.parse(message);
        }
    }, {
        key: "trackRequest",
        value: function trackRequest(requestObject, handler) {
            requestObject.id = ++this._nextId;
            this._requestMap.set(requestObject.id, handler);
            return requestObject;
        }
    }, {
        key: "getHandlerForResponse",
        value: function getHandlerForResponse(_ref) {
            var id = _ref.id;

            if (id == null) {
                return null;
            }
            var handler = this._requestMap.get(id);
            if (handler == null) {
                return null;
            }
            this._requestMap.delete(id);
            return handler;
        }
    }, {
        key: "getPendingHandlerIds",
        value: function getPendingHandlerIds() {
            return this._requestMap.keys();
        }
    }]);
    return JsonFormatter;
}(MessageFormatterBase);