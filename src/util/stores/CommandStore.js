"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CommandStore = void 0;
var discord_js_1 = require("discord.js");
var AliasStore_1 = require("./AliasStore");
var CommandStore = /** @class */ (function (_super) {
    __extends(CommandStore, _super);
    function CommandStore() {
        var _this = _super.call(this) || this;
        _this.aliases = new AliasStore_1.AliasStore();
        return _this;
    }
    CommandStore.prototype.get = function (name) {
        return _super.prototype.get.call(this, name) || this.aliases.get(name);
    };
    CommandStore.prototype.has = function (name) {
        return _super.prototype.has.call(this, name) || this.aliases.has(name);
    };
    CommandStore.prototype.set = function (name, value) {
        _super.prototype.set.call(this, name, value);
        if (value.aliases.length) {
            for (var _i = 0, _a = value.aliases; _i < _a.length; _i++) {
                var alias = _a[_i];
                this.aliases.set(alias, value);
            }
        }
        return this;
    };
    CommandStore.prototype["delete"] = function (name) {
        var cmd = _super.prototype.get.call(this, name);
        if (!cmd) {
            return false;
        }
        _super.prototype["delete"].call(this, name);
        if (cmd.aliases && cmd.aliases.length) {
            for (var _i = 0, _a = cmd.aliases; _i < _a.length; _i++) {
                var alias = _a[_i];
                this.aliases["delete"](alias);
            }
        }
        return true;
    };
    CommandStore.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.aliases.clear();
    };
    return CommandStore;
}(discord_js_1.Collection));
exports.CommandStore = CommandStore;
