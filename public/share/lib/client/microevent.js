// Generated by CoffeeScript 1.6.2
var MicroEvent, nextTick,
  __slice = [].slice;

nextTick = typeof WEB !== "undefined" && WEB !== null ? function(fn) {
  return setTimeout(fn, 0);
} : process['nextTick'];

MicroEvent = (function() {
  function MicroEvent() {}

  MicroEvent.prototype.on = function(event, f) {
    var _base;

    this._events || (this._events = {});
    (_base = this._events)[event] || (_base[event] = []);
    this._events[event].push(f);
    return this;
  };

  MicroEvent.prototype.removeListener = function(event, fct) {
    var i, listeners, _base,
      _this = this;

    this._events || (this._events = {});
    listeners = ((_base = this._events)[event] || (_base[event] = []));
    i = 0;
    while (i < listeners.length) {
      if (listeners[i] === fct) {
        listeners[i] = void 0;
      }
      i++;
    }
    nextTick(function() {
      var x;

      return _this._events[event] = (function() {
        var _i, _len, _ref, _results;

        _ref = this._events[event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          if (x) {
            _results.push(x);
          }
        }
        return _results;
      }).call(_this);
    });
    return this;
  };

  MicroEvent.prototype.emit = function() {
    var args, event, fn, _i, _len, _ref, _ref1;

    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!((_ref = this._events) != null ? _ref[event] : void 0)) {
      return this;
    }
    _ref1 = this._events[event];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      fn = _ref1[_i];
      if (fn) {
        fn.apply(this, args);
      }
    }
    return this;
  };

  MicroEvent.prototype.once = function(event, f) {
    var listener,
      _this = this;

    return this.on(event, listener = function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _this.removeListener(event, listener);
      return f.apply(_this, args);
    });
  };

  return MicroEvent;

})();

MicroEvent.mixin = function(obj) {
  var proto;

  proto = obj.prototype || obj;
  proto.on = MicroEvent.prototype.on;
  proto.removeListener = MicroEvent.prototype.removeListener;
  proto.emit = MicroEvent.prototype.emit;
  proto.once = MicroEvent.prototype.once;
  return obj;
};

if (typeof WEB === "undefined" || WEB === null) {
  module.exports = MicroEvent;
}
