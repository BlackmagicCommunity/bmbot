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
var discord_js_1 = require("discord.js");
exports["default"] = discord_js_1.Structures.extend('Message', function (message) {
    var Message = /** @class */ (function (_super) {
        __extends(Message, _super);
        function Message(client, data, channel) {
            return _super.call(this, client, data, channel) || this;
        }
        Message.prototype.reply = function (content, options) {
            return this.channel.send(content instanceof discord_js_1.APIMessage ? content : discord_js_1.APIMessage.transformOptions(content, options, { reply: this.member || this.author }));
        };
        Message.prototype.combineContentOptions = function (content, options) {
            if (!options)
                return Object.prototype.toString.call(content) === '[object Object]' ? content : { content: content };
            return Object.assign(options, { content: content });
        };
        return Message;
    }(message));
    return Message;
});
