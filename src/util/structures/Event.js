"use strict";
exports.__esModule = true;
exports.Event = void 0;
var Event = /** @class */ (function () {
    function Event(client) {
        Object.defineProperty(this, 'client', { value: client });
    }
    Event.prototype.main = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return true;
    };
    return Event;
}());
exports.Event = Event;
