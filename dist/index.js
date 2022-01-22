/* eslint no-bitwise: "off" */

/* eslint no-restricted-syntax: "off" */
const crc16Table = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];
/**
 * @param {Buffer} buffer
 */

function crc16(buffer) {
  let checksum = 0;

  for (const byte of buffer) {
    [checksum] = new Uint16Array([crc16Table[(checksum >> 8 ^ byte) & 0xFF] ^ checksum << 8]);
  }

  return checksum;
}

class VescBuffer {
  /**
   * @param {Buffer} buffer
   */
  constructor(buffer) {
    this.buffer = buffer;
    this.index = 0;
  }

  raw() {
    return this.buffer;
  }

  size() {
    return this.buffer.length;
  }

  readString() {
    let value = '';
    let charCode;
    let char = '';

    while (charCode !== 0x00 && this.index < this.buffer.length) {
      value = `${value}${char}`;
      charCode = this.readUInt8();
      char = String.fromCharCode(charCode);
    }

    return value;
  }

  slice(expected) {
    if (this.index + expected <= this.buffer.length) {
      const value = this.buffer.slice(this.index, this.index + expected - 1);
      this.index += expected - 1;
      return value;
    }

    return Buffer.from([]);
  }

  readUInt8() {
    const value = this.buffer.readUInt8(this.index);
    this.index += 1;
    return value;
  }

  readUInt16() {
    const value = this.buffer.readUInt16BE(this.index);
    this.index += 2;
    return value;
  }

  readUInt32() {
    const value = this.buffer.readUInt32BE(this.index);
    this.index += 4;
    return value;
  }

  readInt8() {
    const value = this.buffer.readInt8(this.index);
    this.index += 1;
    return value;
  }

  readInt16() {
    const value = this.buffer.readInt16BE(this.index);
    this.index += 2;
    return value;
  }

  readInt32() {
    const value = this.buffer.readInt32BE(this.index);
    this.index += 4;
    return value;
  }

  readDouble16(scale) {
    return this.readInt16() / scale;
  }

  readDouble32(scale) {
    return this.readInt32() / scale;
  }

}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var loglevel = {exports: {}};

/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/

(function (module) {
(function (root, definition) {
    if (module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(commonjsGlobal, function () {

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      defaultLevel = defaultLevel == null ? "WARN" : defaultLevel;

      var storageKey = "loglevel";
      if (typeof name === "string") {
        storageKey += ":" + name;
      } else if (typeof name === "symbol") {
        storageKey = undefined;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType || !storageKey) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage.removeItem(storageKey);
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch (ignore) {}
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          defaultLevel = level;
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.resetLevel = function () {
          self.setLevel(defaultLevel, false);
          clearPersistedLevel();
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    // ES6 default export, for compatibility
    defaultLogger['default'] = defaultLogger;

    return defaultLogger;
}));
}(loglevel));

var logger = loglevel.exports;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
    return typeof x === 'function';
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = /*@__PURE__*/ new Error();
            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
    setTimeout(function () { throw err; }, 0);
}

/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError(err);
        }
    },
    complete: function () { }
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
    return x !== null && typeof x === 'object';
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
})();
var UnsubscriptionError = UnsubscriptionErrorImpl;

/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
var Subscription = /*@__PURE__*/ (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._ctorUnsubscribe = true;
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
        }
        else if (_parentOrParents !== null) {
            for (var index = 0; index < _parentOrParents.length; ++index) {
                var parent_1 = _parentOrParents[index];
                parent_1.remove(this);
            }
        }
        if (isFunction(_unsubscribe)) {
            if (_ctorUnsubscribe) {
                this._unsubscribe = undefined;
            }
            try {
                _unsubscribe.call(this);
            }
            catch (e) {
                errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if (isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject(sub)) {
                    try {
                        sub.unsubscribe();
                    }
                    catch (e) {
                        errors = errors || [];
                        if (e instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        }
                        else {
                            errors.push(e);
                        }
                    }
                }
            }
        }
        if (errors) {
            throw new UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        var subscription = teardown;
        if (!teardown) {
            return Subscription.EMPTY;
        }
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (!(subscription instanceof Subscription)) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default: {
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
        }
        var _parentOrParents = subscription._parentOrParents;
        if (_parentOrParents === null) {
            subscription._parentOrParents = this;
        }
        else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
                return subscription;
            }
            subscription._parentOrParents = [_parentOrParents, this];
        }
        else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
        }
        else {
            return subscription;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions === null) {
            this._subscriptions = [subscription];
        }
        else {
            subscriptions.push(subscription);
        }
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = /*@__PURE__*/ (function () {
    return typeof Symbol === 'function'
        ? /*@__PURE__*/ Symbol('rxSubscriber')
        : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
})();

/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
var Subscriber = /*@__PURE__*/ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        _this.destination = destinationOrNext;
                        destinationOrNext.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _parentOrParents = this._parentOrParents;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = _parentOrParents;
        return this;
    };
    return Subscriber;
}(Subscription));
var SafeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== empty) {
                context = Object.create(observerOrNext);
                if (isFunction(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
function canReportError(observer) {
    while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}

/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber]) {
            return nextOrObserver[rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber(empty);
    }
    return new Subscriber(nextOrObserver, error, complete);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
    return x;
}

/** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
var Observable = /*@__PURE__*/ (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        }
        else {
            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
    function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = 'object unsubscribed';
        this.name = 'ObjectUnsubscribedError';
        return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return ObjectUnsubscribedErrorImpl;
})();
var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var SubjectSubscription = /*@__PURE__*/ (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription));

/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(Subscriber));
var Subject = /*@__PURE__*/ (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = /*@__PURE__*/ (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));

/* eslint no-bitwise: "off" */
const PACKET_HEADER = 1;
const PACKET_LENGTH = 2;
const PACKET_LENGTH_SECOND = 22;
const PACKET_PAYLOAD = 3;
const PACKET_CRC_SECOND = 33;
const PACKET_CRC = 4;
const packetTemplate = {
  packetType: 0,
  packetSize: 0,
  payloadType: 0,
  payload: null,
  crc: 0
};
class VescMessageHandler {
  constructor(parser) {
    this.vescMessageParser = parser;
    this.vescMessages = new Subject();
    this.buffer = Buffer.alloc(0);
    this.packet = { ...packetTemplate
    };
    this.payloadPosition = 0;
    this.packetStartFound = false;
    this.packetState = 0;
    this.vescMessages.subscribe(message => {
      const data = Buffer.concat([this.buffer, message]);

      for (const [i, byte] of data.entries()) {
        if (this.packetStartFound) {
          switch (this.packetState) {
            case PACKET_HEADER:
              if (this.packet.packetType === 2) {
                this.packet.packetSize = byte;
                this.packetState = PACKET_LENGTH;
                logger.debug(`PACKET_HEADER received short package: ${this.packet.packetType}, packetSize: ${this.packet.packetSize}`);
              } else {
                this.packet.packetSize = byte << 8;
                this.packetState = PACKET_LENGTH_SECOND;
                logger.debug(`PACKET_HEADER received long package: ${this.packet.packetType}, packetSize: ${this.packet.packetSize}`);
              }

              break;

            case PACKET_LENGTH_SECOND:
              this.packet.packetSize |= byte;
              this.packetState = PACKET_LENGTH;
              logger.debug(`PACKET_LENGTH_SECOND packetSize: ${this.packet.packetSize}`);
              break;

            case PACKET_LENGTH:
              if (this.packet.payload === null) {
                this.packet.payload = Buffer.alloc(this.packet.packetSize);
              }

              this.packet.payload[this.payloadPosition] = byte;
              this.payloadPosition += 1;

              if (this.payloadPosition >= this.packet.packetSize) {
                this.packetState = PACKET_PAYLOAD;
              }

              logger.debug(`PACKET_LENGTH position: ${this.payloadPosition}`);
              break;

            case PACKET_PAYLOAD:
              this.packet.crc = byte << 8;
              this.packetState = PACKET_CRC_SECOND;
              logger.debug(`PACKET_PAYLOAD crc: ${this.packet.crc}, byte ${byte}`);
              break;

            case PACKET_CRC_SECOND:
              this.packet.crc |= byte;
              logger.debug(`PACKET_CRC_SECOND crc: ${this.packet.crc}, byte ${byte}`);

              if (this.packet.crc !== crc16(this.packet.payload)) {
                logger.debug(`CRC "${crc16(this.packet.payload)}" doesn't match received CRC "${this.packet.crc}"`);
                this.resetState();
                break;
              }

              this.packetState = PACKET_CRC;
              break;

            case PACKET_CRC:
              if (byte !== 3) {
                logger.debug(`Invalid End Packet Byte received: "${byte}"`);
              } else {
                this.vescMessageParser.queueMessage({
                  type: this.packet.payload.readUInt8(0),
                  payload: this.packet.payload.slice(1)
                });
              }

              this.resetState();
              this.buffer = data.slice(i + 1);
              break;

            default:
              logger.debug(`Should never reach this packetState "${this.packetState}`);
          }
        } else if (byte === 2 || byte === 3) {
          this.packetStartFound = true;
          this.packetState = PACKET_HEADER;
          this.packet.packetType = byte;
          this.position = 1;
        } else {
          logger.debug(`Unknown byte "${byte}" received at state "${this.packetState}"`);
        }
      }
    });
  }

  queueMessage(message) {
    this.vescMessages.next(message);
  }

  resetState() {
    this.packetState = 0;
    this.packet = { ...packetTemplate
    };
    this.payloadPosition = 0;
    this.packetStartFound = false;
    this.buffer = Buffer.alloc(0);
  }

}

var PacketTypes = {
  COMM_FW_VERSION: 0,
  COMM_JUMP_TO_BOOTLOADER: 1,
  COMM_ERASE_NEW_APP: 2,
  COMM_WRITE_NEW_APP_DATA: 3,
  COMM_GET_VALUES: 4,
  COMM_SET_DUTY: 5,
  COMM_SET_CURRENT: 6,
  COMM_SET_CURRENT_BRAKE: 7,
  COMM_SET_RPM: 8,
  COMM_SET_POS: 9,
  COMM_SET_HANDBRAKE: 10,
  COMM_SET_DETECT: 11,
  COMM_SET_SERVO_POS: 12,
  COMM_SET_MCCONF: 13,
  COMM_GET_MCCONF: 14,
  COMM_GET_MCCONF_DEFAULT: 15,
  COMM_SET_APPCONF: 16,
  COMM_GET_APPCONF: 17,
  COMM_GET_APPCONF_DEFAULT: 18,
  COMM_SAMPLE_PRINT: 19,
  COMM_TERMINAL_CMD: 20,
  COMM_PRINT: 21,
  COMM_ROTOR_POSITION: 22,
  COMM_EXPERIMENT_SAMPLE: 23,
  COMM_DETECT_MOTOR_PARAM: 24,
  COMM_DETECT_MOTOR_R_L: 25,
  COMM_DETECT_MOTOR_FLUX_LINKAGE: 26,
  COMM_DETECT_ENCODER: 27,
  COMM_DETECT_HALL_FOC: 28,
  COMM_REBOOT: 29,
  COMM_ALIVE: 30,
  COMM_GET_DECODED_PPM: 31,
  COMM_GET_DECODED_ADC: 32,
  COMM_GET_DECODED_CHUK: 33,
  COMM_FORWARD_CAN: 34,
  COMM_SET_CHUCK_DATA: 35,
  COMM_CUSTOM_APP_DATA: 36,
  COMM_NRF_START_PAIRING: 37,
  COMM_GET_IMU_DATA: 79
};

/**
 * @param {Buffer} buffer
 */
function bufferToArray(buffer) {
  return [...buffer].map(byte => byte.toString(16)).map(byte => {
    if (byte.length < 2) {
      return `0${byte}`;
    }

    return byte;
  });
}
/**
 * @param {VescBuffer} payload
 */

function getFWVersion(payload) {
  const response = {
    version: {
      major: -1,
      minor: -1
    },
    hardware: 'UNKNOWN',
    uuid: null
  };

  if (payload.size() >= 2) {
    response.version.major = payload.readUInt8();
    response.version.minor = payload.readUInt8();
    response.hardware = payload.readString();
    response.uuid = bufferToArray(payload.slice(12));
  }

  return Promise.resolve(response);
}
/**
 * @param {VescBuffer} payload
 */

function getValues(payload) {
  const response = {
    temp: {
      mosfet: 0.0,
      motor: 0.0
    },
    current: {
      motor: 0.0,
      battery: 0.0
    },
    id: 0.0,
    iq: 0.0,
    dutyCycle: 0.0,
    erpm: 0.0,
    voltage: 0.0,
    ampHours: {
      consumed: 0.0,
      charged: 0.0
    },
    wattHours: {
      consumed: 0.0,
      charged: 0.0
    },
    tachometer: {
      value: 0.0,
      abs: 0.0
    },
    faultCode: 0
  };
  response.temp.mosfet = payload.readDouble16(1e1);
  response.temp.motor = payload.readDouble16(1e1);
  response.current.motor = payload.readDouble32(1e2);
  response.current.battery = payload.readDouble32(1e2);
  response.id = payload.readDouble32(1e2);
  response.iq = payload.readDouble32(1e2);
  response.dutyCycle = payload.readDouble16(1e3);
  response.erpm = payload.readDouble32(1e0);
  response.voltage = payload.readDouble16(1e1);
  response.ampHours.consumed = payload.readDouble32(1e4);
  response.ampHours.charged = payload.readDouble32(1e4);
  response.wattHours.consumed = payload.readDouble32(1e4);
  response.wattHours.charged = payload.readDouble32(1e4);
  response.tachometer.value = payload.readInt32();
  response.tachometer.abs = payload.readInt32();
  response.faultCode = payload.readInt8();
  return Promise.resolve(response);
}
/**
 * @param {VescBuffer} payload
 */

function getDecodedPPM(payload) {
  const response = {
    decodedPPM: 0.0,
    ppmLastLen: 0.0
  };
  response.decodedPPM = payload.readDouble32(1e6);
  response.ppmLastLen = payload.readDouble32(1e6);
  return Promise.resolve(response);
}
/**
 * @param {VescBuffer} payload
 */

function getMotorConfiguration(payload) {
  const response = {
    message: 'yeah',
    payload
  };
  return Promise.resolve(response);
}
/**
 * @param {VescBuffer} payload
 */

function getAppConfiguration(payload) {
  const response = {
    signature: 0,
    controller_id: 0,
    timeout_msec: 0.0,
    timeout_brake_current: 0.0,
    send_can_status: 0,
    send_can_status_rate_hz: 0,
    can_baud_rate: 0,
    pairing_done: 0,
    permanent_uart_enabled: 0,
    shutdown_mode: 0,
    can_mode: 0,
    uavcan_esc_index: 0,
    uavcan_raw_mode: 0,
    app_to_use: 0,
    app_ppm_conf: {
      ctrl_type: 0,
      pid_max_erpm: 0.0,
      hyst: 0.0,
      pulse_start: 0.0,
      pulse_end: 0.0,
      pulse_center: 0.0,
      median_filter: 0,
      safe_start: 0,
      throttle_exp: 0.0,
      throttle_exp_brake: 0.0,
      throttle_exp_mode: 0,
      ramp_time_pos: 0.0,
      ramp_time_neg: 0.0,
      multi_esc: 0,
      tc: 0,
      tc_max_diff: 0.0,
      max_erpm_for_dir: 0.0,
      smart_rev_max_duty: 0.0,
      smart_rev_ramp_time: 0.0
    },
    app_adc_conf: {
      ctrl_type: 0,
      hyst: 0.0,
      voltage_start: 0.0,
      voltage_end: 0.0,
      voltage_center: 0.0,
      voltage2_start: 0.0,
      voltage2_end: 0.0,
      use_filter: 0,
      safe_start: 0,
      cc_button_inverted: 0,
      rev_button_inverted: 0,
      voltage_inverted: 0,
      voltage2_inverted: 0,
      throttle_exp: 0.0,
      throttle_exp_brake: 0.0
    },
    app_chuk_conf: {},
    app_nrf_conf: {},
    app_balance_conf: {},
    app_pas_conf: {},
    imu_conf: {}
  };
  response.signature = payload.readInt32();
  response.controller_id = payload.readInt8();
  response.timeout_msec = payload.readInt32();
  response.timeout_brake_current = payload.readDouble32(1e0);
  response.send_can_status = payload.readInt8();
  response.send_can_status_rate_hz = payload.readUInt16();
  response.can_baud_rate = payload.readInt8();
  response.pairing_done = payload.readInt8();
  response.permanent_uart_enabled = payload.readInt8();
  response.shutdown_mode = payload.readInt8();
  response.can_mode = payload.readInt8();
  response.uavcan_esc_index = payload.readInt8();
  response.uavcan_raw_mode = payload.readInt8();
  response.app_to_use = payload.readInt8();
  response.app_ppm_conf.ctrl_type = payload.readInt8();
  response.app_ppm_conf.pid_max_erpm = payload.readDouble32(1e2);
  response.app_ppm_conf.hyst = payload.readDouble32(1e4);
  response.app_ppm_conf.pulse_start = payload.readDouble32(1e4);
  response.app_ppm_conf.pulse_end = payload.readDouble32(1e4);
  response.app_ppm_conf.pulse_center = payload.readDouble32(1e4);
  response.app_ppm_conf.median_filter = payload.readInt8();
  response.app_ppm_conf.safe_start = payload.readInt8();
  response.app_ppm_conf.throttle_exp = payload.readDouble32();
  response.app_ppm_conf.throttle_exp_brake = payload.readDouble32();
  response.app_ppm_conf.throttle_exp_mode = payload.readInt8();
  response.app_ppm_conf.ramp_time_pos = payload.readDouble32();
  response.app_ppm_conf.ramp_time_neg = payload.readDouble32();
  response.app_ppm_conf.multi_esc = payload.readInt8();
  response.app_ppm_conf.tc = payload.readInt8();
  response.app_ppm_conf.tc_max_diff = payload.readDouble32();
  response.app_ppm_conf.max_erpm_for_dir = payload.readDouble32();
  response.app_ppm_conf.smart_rev_max_duty = payload.readDouble32();
  response.app_ppm_conf.smart_rev_ramp_time = payload.readDouble32();
  response.app_adc_conf.hyst = payload.readDouble32();
  response.app_adc_conf.voltage_start = payload.readDouble32();
  response.app_adc_conf.voltage_end = payload.readDouble32();
  response.app_adc_conf.voltage_center = payload.readDouble32();
  response.app_adc_conf.voltage2_start = payload.readDouble32();
  response.app_adc_conf.voltage2_end = payload.readDouble32();
  response.app_adc_conf.use_filter = payload.readInt8();
  response.app_adc_conf.safe_start = payload.readInt8();
  response.app_adc_conf.cc_button_inverted = payload.readInt8();
  response.app_adc_conf.rev_button_inverted = payload.readInt8();
  response.app_adc_conf.voltage_inverted = payload.readInt8();
  response.app_adc_conf.voltage2_inverted = payload.readInt8();
  response.app_adc_conf.throttle_exp = payload.readDouble32();
  response.app_adc_conf.throttle_exp_brake = payload.readDouble32();
  return Promise.resolve(response);
}

class VescMessageParser extends Subject {
  constructor() {
    super();
    this.vescMessages = new Subject();
    this.vescMessages.subscribe(message => {
      const buffer = new VescBuffer(message.payload);
      const packetType = Object.keys(PacketTypes)[message.type];
      logger.debug(`Received PacketType: "${packetType}"`);

      switch (message.type) {
        case PacketTypes.COMM_FW_VERSION:
          getFWVersion(buffer).then(result => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_MCCONF:
          getMotorConfiguration(buffer).then(result => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_APPCONF:
          getAppConfiguration(buffer).then(result => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_VALUES:
          getValues(buffer).then(result => this.pushResult(packetType, result));
          break;

        case PacketTypes.COMM_GET_DECODED_PPM:
          getDecodedPPM(buffer).then(result => this.pushResult(packetType, result));
          break;

        default:
          logger.debug(`Unknown packet type "${message.type}"`);
      }
    });
  }

  pushResult(type, payload) {
    logger.debug(`pushResult: "${type}, ${JSON.stringify(payload)}"`);
    this.next({
      type,
      payload
    });
  }

  queueMessage(message) {
    this.vescMessages.next(message);
  }

}

/* eslint no-bitwise: "off" */

const PACKET_SIZE_WITHOUT_PAYLOAD = 1 + 1 + 2 + 1;
/**
 * @param {Buffer} payload
 */

function generatePacket(payload) {
  let buffer;
  let index = 0;

  if (payload.length <= 256) {
    buffer = Buffer.alloc(payload.length + PACKET_SIZE_WITHOUT_PAYLOAD);
    buffer.writeUInt8(2, index);
    index += 1;
    buffer.writeUInt8(payload.length, index);
    index += 1;
  } else {
    buffer = Buffer.alloc(payload.length + 1 + PACKET_SIZE_WITHOUT_PAYLOAD);
    buffer.writeUInt8(3, index);
    index += 1;
    buffer.writeUInt8(payload.length >> 8, index);
    index += 1;
    buffer.writeUInt8(payload.length & 0xFF, index);
    index += 1;
  }

  for (let i = 0; i < payload.length; i += 1, index += 1) {
    buffer.writeUInt8(payload[i], index);
  }

  const crc = crc16(payload);
  buffer.writeUInt8(crc >> 8, index);
  index += 1;
  buffer.writeUInt8(crc & 0xFF, index);
  index += 1;
  buffer.writeUInt8(3, index);
  return buffer;
}

const packetTypes = {
  COMM_FW_VERSION: 0,
  COMM_JUMP_TO_BOOTLOADER: 1,
  COMM_ERASE_NEW_APP: 2,
  COMM_WRITE_NEW_APP_DATA: 3,
  COMM_GET_VALUES: 4,
  COMM_SET_DUTY: 5,
  COMM_SET_CURRENT: 6,
  COMM_SET_CURRENT_BRAKE: 7,
  COMM_SET_RPM: 8,
  COMM_SET_POS: 9,
  COMM_SET_HANDBRAKE: 10,
  COMM_SET_DETECT: 11,
  COMM_SET_SERVO_POS: 12,
  COMM_SET_MCCONF: 13,
  COMM_GET_MCCONF: 14,
  COMM_GET_MCCONF_DEFAULT: 15,
  COMM_SET_APPCONF: 16,
  COMM_GET_APPCONF: 17,
  COMM_GET_APPCONF_DEFAULT: 18,
  COMM_SAMPLE_PRINT: 19,
  COMM_TERMINAL_CMD: 20,
  COMM_PRINT: 21,
  COMM_ROTOR_POSITION: 22,
  COMM_EXPERIMENT_SAMPLE: 23,
  COMM_DETECT_MOTOR_PARAM: 24,
  COMM_DETECT_MOTOR_R_L: 25,
  COMM_DETECT_MOTOR_FLUX_LINKAGE: 26,
  COMM_DETECT_ENCODER: 27,
  COMM_DETECT_HALL_FOC: 28,
  COMM_REBOOT: 29,
  COMM_ALIVE: 30,
  COMM_GET_DECODED_PPM: 31,
  COMM_GET_DECODED_ADC: 32,
  COMM_GET_DECODED_CHUK: 33,
  COMM_FORWARD_CAN: 34,
  COMM_SET_CHUCK_DATA: 35,
  COMM_CUSTOM_APP_DATA: 36,
  COMM_NRF_START_PAIRING: 37
};
const packerTypeToString = {
  0: 'COMM_FW_VERSION',
  1: 'COMM_JUMP_TO_BOOTLOADER',
  2: 'COMM_ERASE_NEW_APP',
  3: 'COMM_WRITE_NEW_APP_DATA',
  4: 'COMM_GET_VALUES',
  5: 'COMM_SET_DUTY',
  6: 'COMM_SET_CURRENT',
  7: 'COMM_SET_CURRENT_BRAKE',
  8: 'COMM_SET_RPM',
  9: 'COMM_SET_POS',
  10: 'COMM_SET_HANDBRAKE',
  11: 'COMM_SET_DETECT',
  12: 'COMM_SET_SERVO_POS',
  13: 'COMM_SET_MCCONF',
  14: 'COMM_GET_MCCONF',
  15: 'COMM_GET_MCCONF_DEFAULT',
  16: 'COMM_SET_APPCONF',
  17: 'COMM_GET_APPCONF',
  18: 'COMM_GET_APPCONF_DEFAULT',
  19: 'COMM_SAMPLE_PRINT',
  20: 'COMM_TERMINAL_CMD',
  21: 'COMM_PRINT',
  22: 'COMM_ROTOR_POSITION',
  23: 'COMM_EXPERIMENT_SAMPLE',
  24: 'COMM_DETECT_MOTOR_PARAM',
  25: 'COMM_DETECT_MOTOR_R_L',
  26: 'COMM_DETECT_MOTOR_FLUX_LINKAGE',
  27: 'COMM_DETECT_ENCODER',
  28: 'COMM_DETECT_HALL_FOC',
  29: 'COMM_REBOOT',
  30: 'COMM_ALIVE',
  31: 'COMM_GET_DECODED_PPM',
  32: 'COMM_GET_DECODED_ADC',
  33: 'COMM_GET_DECODED_CHUK',
  34: 'COMM_FORWARD_CAN',
  35: 'COMM_SET_CHUCK_DATA',
  36: 'COMM_CUSTOM_APP_DATA',
  37: 'COMM_NRF_START_PAIRING'
};
const notRequiredResponsePacket = [packetTypes.COMM_JUMP_TO_BOOTLOADER, packetTypes.COMM_SET_DUTY, packetTypes.COMM_SET_CURRENT, packetTypes.COMM_SET_CURRENT_BRAKE, packetTypes.COMM_SET_RPM, packetTypes.COMM_SET_POS, packetTypes.COMM_SET_HANDBRAKE, packetTypes.COMM_SET_DETECT, packetTypes.COMM_SET_SERVO_POS, packetTypes.COMM_REBOOT, packetTypes.COMM_ALIVE, packetTypes.COMM_FORWARD_CAN, packetTypes.COMM_SET_CHUCK_DATA, packetTypes.COMM_CUSTOM_APP_DATA];

export { VescBuffer, VescMessageHandler, VescMessageParser, crc16, generatePacket, notRequiredResponsePacket, packerTypeToString, packetTypes };
//# sourceMappingURL=index.js.map
