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
exports.AliasStore = void 0;
var discord_js_1 = require("discord.js");
var AliasStore = /** @class */ (function (_super) {
    __extends(AliasStore, _super);
    function AliasStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AliasStore;
}(discord_js_1.Collection));
exports.AliasStore = AliasStore;
