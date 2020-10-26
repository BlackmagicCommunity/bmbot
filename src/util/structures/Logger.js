"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Logger = void 0;
var dateformat_1 = require("dateformat");
var discord_js_1 = require("discord.js");
var colors = {
    'Member Ban': 'RED',
    'Member Unban': 'GREEN',
    'Message Update': 'YELLOW',
    'Message Delete': 'RED',
    'Message Bulk Delete': 'RED'
};
var Logger = /** @class */ (function () {
    function Logger(client) {
        this.channels = {};
        Object.defineProperty(this, 'client', { value: client });
    }
    Logger.prototype.message = function (message, action, otherData) {
        if (this.channels.messages === null)
            return;
        var channel = this.channels.messages;
        var embed = new discord_js_1.MessageEmbed().setColor(colors[action]).setTitle(action).setTimestamp();
        if (message instanceof discord_js_1.Collection) {
            // bulk delete
            var str_1 = '';
            message
                .sort(function (a, b) {
                return a.createdTimestamp > b.createdTimestamp ? -1 : a.createdTimestamp < b.createdTimestamp ? 1 : 0;
            })
                .forEach(function (m) {
                str_1 += "<tr><td>" + m.author.id + "</td><td>" + m.author.tag + "</td><td>" + m.content + "</td><td>" + dateformat_1["default"](m.createdTimestamp, 'yyyy-mm-dd h:MM TT') + "</td></tr>\n";
            });
            var file = "<!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Bulk Delete at " + new Date() + "</title>\n        <style>\n        table, td, th {\n          border: 1px solid black;\n        }\n        td {\n          padding:5px;\n        }\n        table {\n          border-collapse: collapse;\n        }\n        tr:nth-child(even) {\n          background:#eee;\n        }</style>\n      </head>\n      <body>\n        <table>\n          <tr><th>id</th> <th>tag</th> <th>content</th> <th>date</th></tr>\n          " + str_1 + "\n        </table>\n      </body>\n      </html>";
            embed
                .addField('Amount of messages', message.size)
                .addField('Channel', "" + message.first().channel)
                .attachFiles([new discord_js_1.MessageAttachment(Buffer.from(file), 'message_list.html')]);
        }
        else {
            if (message.content)
                embed.setDescription(message.cleanContent);
            if (otherData instanceof discord_js_1.Message && otherData.content)
                embed.addField('Old Content', otherData.content.length > 1024 ? otherData.content.substring(0, 1021) + "..." : otherData.content);
            if (colors[action] !== 'Message Delete')
                embed.addField('Link', "[Jump to Message](https://discord.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id + ")");
        }
        channel.send(embed);
    };
    Logger.prototype.join = function (member, left) {
        if (left === void 0) { left = false; }
        return __awaiter(this, void 0, void 0, function () {
            var channel, used, cached, current_1, embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.channels.joins === null)
                            return [2 /*return*/];
                        channel = this.channels.joins;
                        if (!!left) return [3 /*break*/, 2];
                        cached = this.client.invites.get(member.guild.id);
                        return [4 /*yield*/, member.guild.fetchInvites()];
                    case 1:
                        current_1 = _a.sent();
                        used = cached.find(function (invite) {
                            return current_1.get(invite.code).uses !== invite.uses;
                        });
                        _a.label = 2;
                    case 2:
                        embed = new discord_js_1.MessageEmbed()
                            .setColor(!left ? 'GREEN' : 'RED')
                            .setThumbnail(member.user.displayAvatarURL())
                            .addField('User', "**" + member.user.username + "**#" + member.user.discriminator + " (" + member.id + ")")
                            .addField('Mention', "" + member)
                            .setTimestamp();
                        if (used)
                            embed.addField('Invited by', "**" + used.inviter.username + "**#" + used.inviter.discriminator + " (" + used.inviter.id + ") - " + used.uses + " uses");
                        channel.send(embed);
                        return [2 /*return*/];
                }
            });
        });
    };
    Logger.prototype.infraction = function (action, reason, moderator, target) {
        if (this.channels.infractions === null)
            return;
        var channel = this.channels.infractions;
        var embed = new discord_js_1.MessageEmbed().setTitle(action).setColor(colors[action]).setThumbnail(target.displayAvatarURL());
        if (reason)
            embed.addField('Reason', reason, true);
        embed
            .addField('Target', "**" + target.username + "**#" + target.discriminator + " (" + target.id + ")")
            .addField('Moderator', "**" + moderator.username + "**#" + moderator.discriminator + " (" + moderator.id + ")")
            .setTimestamp();
        channel.send(embed);
    };
    return Logger;
}());
exports.Logger = Logger;
