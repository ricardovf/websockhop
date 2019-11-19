"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require("./utils");

var _browserDetection = require("./browserDetection");

var _Events = require("./Events");

var _Events2 = _interopRequireDefault(_Events);

var _ErrorEnumValue = require("./ErrorEnumValue");

var _ErrorEnumValue2 = _interopRequireDefault(_ErrorEnumValue);

var _formatters = require("./formatters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultCreateSocket(url, protocols) {
    if (!WebSockHop.isAvailable()) {
        throw "WebSockHop cannot be instantiated because one or more validity checks failed.";
    }
    return protocols != null ? new WebSocket(url, protocols) : new WebSocket(url);
}

function extractProtocolsFromOptions() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        protocol = _ref.protocol,
        protocols = _ref.protocols;

    if (Array.isArray(protocols)) {
        return protocols;
    }

    if (typeof protocols === "string" || protocols instanceof String) {
        return [protocols];
    }

    if (typeof protocol === "string" || protocol instanceof String) {
        return [protocol];
    }

    return null;
}

var WebSockHop = function () {
    function WebSockHop(url, opts) {
        (0, _classCallCheck3.default)(this, WebSockHop);

        var protocols = extractProtocolsFromOptions(opts);

        var combinedOptions = (0, _assign2.default)({}, opts, protocols != null ? { protocols: protocols } : null);

        this._opts = combinedOptions;

        this.socket = null;
        this._url = url;
        this._events = new _Events2.default(this);
        this._timer = null;
        this._tries = 0;
        this._aborted = false;
        this._closing = false;
        this.formatter = null;

        this.connectionTimeoutMsecs = 10000; // 10 seconds default connection timeout

        this._pingTimer = null;
        this._lastSentPing = null;
        this._lastReceivedPongId = 0;
        this.pingIntervalMsecs = 60000; // 60 seconds default ping timeout
        this.pingResponseTimeoutMsecs = 10000; // 10 seconds default ping response timeout

        this.defaultRequestTimeoutMsecs = null; // Unless specified, request() calls use this value for timeout
        this.defaultDisconnectOnRequestTimeout = false; // If specified, request "timeout" events will handle as though socket was dropped

        this.protocol = null; // This will eventually hold the protocol that we successfully connected with

        this._attemptConnect();
    }

    (0, _createClass3.default)(WebSockHop, [{
        key: "_attemptConnect",
        value: function _attemptConnect() {
            var _this = this;

            if (!this._timer) {
                var delay = 0;
                if (this._tries > 0) {
                    var timeCap = 1 << Math.min(6, this._tries - 1);
                    delay = timeCap * 1000 + Math.floor(Math.random() * 1000);
                    WebSockHop.log("info", "Trying again in " + delay + "ms");
                }
                this._tries = this._tries + 1;

                this._timer = setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _this._timer = null;
                                    _context.next = 3;
                                    return _this._start();

                                case 3:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                })), delay);
            }
        }
    }, {
        key: "_abortConnect",
        value: function _abortConnect() {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            this._aborted = true;
        }
    }, {
        key: "_raiseEvent",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(event) {
                var _events;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                WebSockHop.log("info", event + " event start");
                                _context2.next = 3;
                                return (_events = this._events).trigger.apply(_events, [event].concat(args));

                            case 3:
                                WebSockHop.log("info", event + " event end");

                            case 4:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _raiseEvent(_x2) {
                return _ref3.apply(this, arguments);
            }

            return _raiseEvent;
        }()
    }, {
        key: "_start",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var _this2 = this;

                var _opts, _opts$createSocket, createSocket, protocols, connectionTimeout, clearConnectionTimeout;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (this.formatter == null) {
                                    WebSockHop.log("info", "No message formatter had been specified, creating a StringFormatter instance as formatter.");
                                    this.formatter = new _formatters.StringFormatter();
                                }
                                _context5.next = 3;
                                return this._raiseEvent("opening");

                            case 3:
                                if (!this._aborted) {
                                    _opts = this._opts, _opts$createSocket = _opts.createSocket, createSocket = _opts$createSocket === undefined ? defaultCreateSocket : _opts$createSocket, protocols = _opts.protocols;

                                    this.socket = createSocket(this._url, protocols);
                                    connectionTimeout = null;

                                    if (this.connectionTimeoutMsecs) {
                                        connectionTimeout = setTimeout(function () {
                                            WebSockHop.log("warn", "Connection timeout exceeded.");
                                            _this2._raiseErrorEvent(false);
                                        }, this.connectionTimeoutMsecs);
                                        WebSockHop.log("info", "Setting connection timeout (" + this.connectionTimeoutMsecs + " msecs).");
                                    }

                                    clearConnectionTimeout = function clearConnectionTimeout() {
                                        if (connectionTimeout != null) {
                                            WebSockHop.log("info", "Clearing connection timeout.");
                                            clearTimeout(connectionTimeout);
                                            connectionTimeout = null;
                                        }
                                    };

                                    this.socket.onopen = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        WebSockHop.log("info", "WebSocket::onopen");
                                                        clearConnectionTimeout();
                                                        _this2.protocol = _this2.socket.protocol;
                                                        _this2._tries = 0;
                                                        _context3.next = 6;
                                                        return _this2._raiseEvent("opened");

                                                    case 6:
                                                        _this2._resetPingTimer();

                                                    case 7:
                                                    case "end":
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this2);
                                    }));
                                    this.socket.onclose = function (_ref6) {
                                        var wasClean = _ref6.wasClean,
                                            code = _ref6.code;

                                        WebSockHop.log("info", "WebSocket::onclose { wasClean: " + (wasClean ? "true" : "false") + ", code: " + code + " }");
                                        clearConnectionTimeout();
                                        var closing = _this2._closing;

                                        if (wasClean) {
                                            (0, _utils.nextUpdate)((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                                    while (1) {
                                                        switch (_context4.prev = _context4.next) {
                                                            case 0:
                                                                _context4.next = 2;
                                                                return _this2._raiseEvent("closed");

                                                            case 2:
                                                                _this2.socket = null;

                                                            case 3:
                                                            case "end":
                                                                return _context4.stop();
                                                        }
                                                    }
                                                }, _callee4, _this2);
                                            })));
                                        } else {
                                            (0, _utils.nextUpdate)(function () {
                                                _this2._raiseErrorEvent(closing);
                                            });
                                        }
                                        _this2._clearPingTimers();
                                    };
                                    this.socket.onmessage = function (_ref8) {
                                        var data = _ref8.data;

                                        (0, _utils.nextUpdate)(function () {
                                            WebSockHop.log("info", "WebSocket::onmessage { data: " + data + " }");
                                            _this2._dispatchMessage(data);
                                        });
                                    };
                                }

                            case 4:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _start() {
                return _ref4.apply(this, arguments);
            }

            return _start;
        }()
    }, {
        key: "_raiseErrorEvent",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(isClosing) {
                var willRetry, pendingRequestIds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, requestId;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                willRetry = !isClosing;
                                _context6.next = 3;
                                return this._raiseEvent("error", willRetry);

                            case 3:
                                this._clearSocket();

                                if (!(this.formatter != null)) {
                                    _context6.next = 33;
                                    break;
                                }

                                pendingRequestIds = this.formatter.getPendingHandlerIds();

                                if (!Array.isArray(pendingRequestIds)) {
                                    _context6.next = 33;
                                    break;
                                }

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context6.prev = 10;
                                _iterator = (0, _getIterator3.default)(pendingRequestIds);

                            case 12:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context6.next = 19;
                                    break;
                                }

                                requestId = _step.value;
                                _context6.next = 16;
                                return this._dispatchErrorMessage(requestId, { type: _ErrorEnumValue2.default.Disconnect });

                            case 16:
                                _iteratorNormalCompletion = true;
                                _context6.next = 12;
                                break;

                            case 19:
                                _context6.next = 25;
                                break;

                            case 21:
                                _context6.prev = 21;
                                _context6.t0 = _context6["catch"](10);
                                _didIteratorError = true;
                                _iteratorError = _context6.t0;

                            case 25:
                                _context6.prev = 25;
                                _context6.prev = 26;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 28:
                                _context6.prev = 28;

                                if (!_didIteratorError) {
                                    _context6.next = 31;
                                    break;
                                }

                                throw _iteratorError;

                            case 31:
                                return _context6.finish(28);

                            case 32:
                                return _context6.finish(25);

                            case 33:
                                if (willRetry) {
                                    this._attemptConnect();
                                }

                            case 34:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[10, 21, 25, 33], [26,, 28, 32]]);
            }));

            function _raiseErrorEvent(_x3) {
                return _ref9.apply(this, arguments);
            }

            return _raiseErrorEvent;
        }()
        // Clear the current this.socket and all state dependent on it.

    }, {
        key: "_clearSocket",
        value: function _clearSocket() {
            this._lastSentPing = null;
            this._lastReceivedPongId = 0;
            this.socket.onclose = function () {
                return WebSockHop.log("info", "closed old socket that had been cleared()");
            };
            this.socket.onmessage = null;
            this.socket.onerror = function (error) {
                return WebSockHop.log("info", "error in old socket that had been cleared()", error);
            };;
            this.socket.close();
            this.protocol = null;
            this.socket = null;
        }
    }, {
        key: "_clearPingTimers",
        value: function _clearPingTimers() {
            WebSockHop.log("info", "clearing ping timers.");
            if (this._pingTimer) {
                clearTimeout(this._pingTimer);
                this._pingTimer = null;
            }
        }
    }, {
        key: "_resetPingTimer",
        value: function _resetPingTimer() {
            var _this3 = this;

            WebSockHop.log("info", "resetting ping timer.");
            this._clearPingTimers();
            this._pingTimer = setTimeout(function () {
                _this3.sendPingRequest();
            }, this.pingIntervalMsecs);
            WebSockHop.log("info", "attempting ping in " + this.pingIntervalMsecs + " ms");
        }
    }, {
        key: "sendPingRequest",
        value: function sendPingRequest() {
            var _this4 = this;

            if (this.formatter != null) {
                var _formatter = this.formatter,
                    pingRequest = _formatter.pingRequest,
                    pingMessage = _formatter.pingMessage;


                if ((0, _utils.isObject)(pingRequest)) {
                    var ping = (0, _assign2.default)({}, pingRequest);
                    this._lastSentPing = this.request(ping, function (obj) {
                        _this4._lastReceivedPongId = obj.id;
                    }, function (error) {
                        if (error.type == _ErrorEnumValue2.default.Timeout) {
                            WebSockHop.log("info", "no ping response, handling as disconnected");
                        }
                    }, this.pingResponseTimeoutMsecs, true);
                    WebSockHop.log("info", "> PING [" + ping.id + "], requiring response in " + this.pingResponseTimeoutMsecs + " ms");
                } else if (pingMessage != null) {
                    this._lastSentPing = this._sendPingMessage(pingMessage, this.pingResponseTimeoutMsecs);
                    WebSockHop.log("info", "> PING, requiring response in " + this.pingResponseTimeoutMsecs + " ms");
                } else {
                    WebSockHop.log("info", "No ping set up for message formatter, not performing ping.");
                }
            } else {
                WebSockHop.log("info", "Time for ping, but no formatter selected, not performing ping.");
            }
        }
    }, {
        key: "send",
        value: function send(obj) {
            if (this.socket) {
                var message = this.formatter.toMessage(obj);
                this.socket.send(message);
            }
        }
    }, {
        key: "close",
        value: function close() {
            var _this5 = this;

            if (this.socket) {
                this._closing = true;
                this.socket.close();
            } else {
                this._abortConnect();
                this._clearPingTimers();
                (0, _utils.nextUpdate)(function () {
                    _this5._raiseErrorEvent(true);
                });
            }
        }
    }, {
        key: "abort",
        value: function abort() {
            if (this.socket) {
                WebSockHop.log("warn", "abort() called on live socket, performing forceful shutdown.  Did you mean to call close() ?");
                this._clearPingTimers();
                this._lastSentPing = null;
                this._lastReceivedPongId = 0;
                this.socket.onclose = null;
                this.socket.onmessage = null;
                this.socket.onerror = null;
                this.socket.close();
                this.socket = null;
                this.protocol = null;
            }
            this._abortConnect();
        }
    }, {
        key: "on",
        value: function on(type, handler) {
            this._events.on(type, handler);
        }
    }, {
        key: "off",
        value: function off(type) {
            var _events2;

            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            (_events2 = this._events).off.apply(_events2, [type].concat(args));
        }
    }, {
        key: "request",
        value: function request(obj, _callback, _errorCallback, timeoutMsecs, disconnectOnTimeout) {
            var request = {
                obj: obj,
                requestTimeoutTimer: null,
                requestTimeoutMsecs: typeof timeoutMsecs !== 'undefined' ? timeoutMsecs : this.defaultRequestTimeoutMsecs,
                requestDisconnectOnTimeout: typeof disconnectOnTimeout !== 'undefined' ? disconnectOnTimeout : this.defaultDisconnectOnRequestTimeout,
                clearTimeout: function (_clearTimeout) {
                    function clearTimeout() {
                        return _clearTimeout.apply(this, arguments);
                    }

                    clearTimeout.toString = function () {
                        return _clearTimeout.toString();
                    };

                    return clearTimeout;
                }(function () {
                    if (this.requestTimeoutTimer != null) {
                        clearTimeout(this.requestTimeoutTimer);
                        this.requestTimeoutTimer = null;
                    }
                })
            };

            this.formatter.trackRequest(obj, {
                callback: function callback(o) {
                    request.clearTimeout();
                    if (_callback != null) {
                        _callback(o);
                    }
                },
                errorCallback: function errorCallback(err) {
                    if (_errorCallback != null) {
                        _errorCallback(err);
                    }
                }
            });
            this.send(obj);
            if (request.requestTimeoutMsecs > 0) {

                this._startRequestTimeout(request);
            }

            return request;
        }
    }, {
        key: "_startRequestTimeout",
        value: function _startRequestTimeout(request) {
            var _this6 = this;

            var id = request.obj.id;

            request.clearTimeout();
            request.requestTimeoutTimer = setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                WebSockHop.log("info", "timeout exceeded [" + id + "]");
                                _context7.next = 3;
                                return _this6._dispatchErrorMessage(id, { type: _ErrorEnumValue2.default.Timeout });

                            case 3:
                                if (!request.requestDisconnectOnTimeout) {
                                    _context7.next = 6;
                                    break;
                                }

                                _context7.next = 6;
                                return _this6._raiseErrorEvent(false);

                            case 6:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, _this6);
            })), request.requestTimeoutMsecs);
        }
    }, {
        key: "_sendPingMessage",
        value: function _sendPingMessage(message, timeoutMsecs) {
            var pingMessage = {
                obj: message,
                messageTimeoutTimer: null,
                messageTimeoutMsecs: typeof timeoutMsecs !== 'undefined' ? timeoutMsecs : this.defaultRequestTimeoutMsecs,
                clearTimeout: function (_clearTimeout2) {
                    function clearTimeout() {
                        return _clearTimeout2.apply(this, arguments);
                    }

                    clearTimeout.toString = function () {
                        return _clearTimeout2.toString();
                    };

                    return clearTimeout;
                }(function () {
                    if (this.messageTimeoutTimer != null) {
                        clearTimeout(this.messageTimeoutTimer);
                        this.messageTimeoutTimer = null;
                    }
                })
            };
            this.send(message);
            if (pingMessage.messageTimeoutMsecs > 0) {
                this._startPingMessageTimeout(pingMessage);
            }
            return pingMessage;
        }
    }, {
        key: "_startPingMessageTimeout",
        value: function _startPingMessageTimeout(pingMessage) {
            var _this7 = this;

            pingMessage.clearTimeout();
            pingMessage.messageTimeoutTimer = setTimeout(function () {
                WebSockHop.log("info", "timeout exceeded");
                _this7._raiseErrorEvent(false);
            }, pingMessage.messageTimeoutMsecs);
        }
    }, {
        key: "_dispatchMessage",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(message) {
                var isHandled, obj, isPong, pongId, _formatter2, pingRequest, pingMessage, handler, isPing;

                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                isHandled = false;
                                obj = this.formatter.fromMessage(message);

                                if (!(this.formatter != null)) {
                                    _context8.next = 32;
                                    break;
                                }

                                isPong = false;
                                pongId = 0;
                                _formatter2 = this.formatter, pingRequest = _formatter2.pingRequest, pingMessage = _formatter2.pingMessage;

                                if (!(0, _utils.isObject)(pingRequest)) {
                                    _context8.next = 16;
                                    break;
                                }

                                // Check for request-based ping response

                                // See if this object is a response to a request().
                                handler = (0, _utils.isObject)(obj) ? this.formatter.getHandlerForResponse(obj) : null;

                                if (!(handler != null)) {
                                    _context8.next = 13;
                                    break;
                                }

                                _context8.next = 11;
                                return _promise2.default.resolve(handler.callback(obj));

                            case 11:
                                if (this._lastSentPing != null && this._lastSentPing.obj != null && this._lastSentPing.obj.id == this._lastReceivedPongId) {
                                    this._lastSentPing = null;
                                    this._lastReceivedPongId = 0;
                                    isPong = true;
                                    pongId = obj.id;
                                }
                                isHandled = true;

                            case 13:

                                // If this is NOT a pong then just extend the response timer, if any
                                if (!isPong && this._lastSentPing != null) {
                                    WebSockHop.log("info", "Non-pong received during pong response period, extending delay...");
                                    this._startRequestTimeout(this._lastSentPing);
                                }

                                _context8.next = 26;
                                break;

                            case 16:
                                if (!(pingMessage != null)) {
                                    _context8.next = 26;
                                    break;
                                }

                                if (!(0, _utils.isFunction)(this.formatter.handlePong)) {
                                    _context8.next = 24;
                                    break;
                                }

                                _context8.next = 20;
                                return _promise2.default.resolve(this.formatter.handlePong(obj));

                            case 20:
                                isPong = _context8.sent;

                                if (isPong) {
                                    isHandled = true;
                                }
                                _context8.next = 25;
                                break;

                            case 24:
                                // If handlePong is null, then any message counts as a pong,
                                // but we don't eat the message.
                                isPong = true;

                            case 25:

                                if (this._lastSentPing != null) {
                                    if (isPong) {
                                        // If this is a pong then clear the pong timer.
                                        this._lastSentPing.clearTimeout();
                                        this._lastSentPing = null;
                                    } else {
                                        // If this is NOT a pong then just extend the response timer, if any
                                        WebSockHop.log("info", "Non-pong received during pong response period, extending delay...");
                                        this._startPingMessageTimeout(this._lastSentPing);
                                    }
                                }

                            case 26:

                                if (isPong) {
                                    if (pongId > 0) {
                                        WebSockHop.log("info", "< PONG [" + pongId + "]");
                                    } else {
                                        WebSockHop.log("info", "< PONG");
                                    }
                                    this._resetPingTimer();
                                }

                                if (!(!isHandled && (0, _utils.isFunction)(this.formatter.handlePing))) {
                                    _context8.next = 32;
                                    break;
                                }

                                _context8.next = 30;
                                return _promise2.default.resolve(this.formatter.handlePing(obj));

                            case 30:
                                isPing = _context8.sent;

                                if (isPing) {
                                    WebSockHop.log("info", "Received PING message, handled.");
                                    isHandled = true;
                                }

                            case 32:
                                if (isHandled) {
                                    _context8.next = 35;
                                    break;
                                }

                                _context8.next = 35;
                                return this._raiseEvent("message", obj);

                            case 35:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function _dispatchMessage(_x4) {
                return _ref11.apply(this, arguments);
            }

            return _dispatchMessage;
        }()
    }, {
        key: "_dispatchErrorMessage",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(id, error) {
                var handler;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (!(this.formatter != null)) {
                                    _context9.next = 5;
                                    break;
                                }

                                handler = this.formatter.getHandlerForResponse({ id: id });

                                if (!(handler != null)) {
                                    _context9.next = 5;
                                    break;
                                }

                                _context9.next = 5;
                                return _promise2.default.resolve(handler.errorCallback(error));

                            case 5:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function _dispatchErrorMessage(_x5, _x6) {
                return _ref12.apply(this, arguments);
            }

            return _dispatchErrorMessage;
        }()
    }], [{
        key: "isAvailable",
        value: function isAvailable() {
            if ((0, _browserDetection.isWebSocketUnavailable)()) {
                return false;
            }

            if (this.disable.oldSafari && (0, _browserDetection.isInvalidSafari)()) {
                return false;
            }

            if (this.disable.mobile && (0, _browserDetection.isMobile)()) {
                return false;
            }

            return true;
        }
    }]);
    return WebSockHop;
}();

WebSockHop.logger = null;
if (process.env.NODE_ENV === 'development') {
    WebSockHop.logger = function (type) {
        var _console;

        for (var _len3 = arguments.length, message = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            message[_key3 - 1] = arguments[_key3];
        }

        (_console = console).log.apply(_console, ["WebSockHop: " + type + " -"].concat(message));
    };
}

WebSockHop.log = function (type) {
    for (var _len4 = arguments.length, message = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        message[_key4 - 1] = arguments[_key4];
    }

    if (WebSockHop.logger != null) {
        WebSockHop.logger.apply(WebSockHop, [type].concat(message));
    }
};

WebSockHop.disable = { oldSafari: true, mobile: true };
WebSockHop.ErrorEnumValue = _ErrorEnumValue2.default;
WebSockHop.StringFormatter = _formatters.StringFormatter;
WebSockHop.JsonFormatter = _formatters.JsonFormatter;
WebSockHop.MessageFormatterBase = _formatters.MessageFormatterBase;

exports.default = WebSockHop;