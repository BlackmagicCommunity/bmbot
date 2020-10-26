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
exports.ClientUtil = void 0;
var ClientUtil = /** @class */ (function () {
    function ClientUtil(client) {
        Object.defineProperty(this, 'client', { value: client });
    }
    ClientUtil.prototype.isOwner = function (id) {
        return this.client.settings.owner === id;
    };
    ClientUtil.prototype.isDeveloper = function (id) {
        return this.client.settings.developers.includes(id);
    };
    ClientUtil.prototype.formatNumber = function (value) {
        if (value >= 1000000000)
            return (value / 1000000000).toFixed(1) + "B";
        if (value >= 1000000)
            return (value / 1000000).toFixed(1) + "M";
        if (value >= 1000)
            return (value / 1000).toFixed(1) + "K";
        return value.toString();
    };
    ClientUtil.prototype.clean = function (text) {
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(new RegExp("" + this.client.token, 'g'), 'Token');
    };
    ClientUtil.prototype.getUser = function (message, arg) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (message.mentions.users.size !== 0)
                            return [2 /*return*/, message.mentions.users.first()];
                        if (/[0-9]{16,18}/.test(arg))
                            return [2 /*return*/, this.client.users.fetch(arg)];
                        arg = arg.toLowerCase();
                        if (!/[a-zA-Z]{1,30}/.test(arg)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.guild.members.fetch()];
                    case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (member) { return member.user.username.toLowerCase().includes(arg); })) === null || _a === void 0 ? void 0 : _a.user];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    ClientUtil.prototype.getMember = function (message, arg) {
        return __awaiter(this, void 0, void 0, function () {
            var user, member;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUser(message, arg)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, message.guild.members.fetch({ user: user })];
                    case 2:
                        member = _a.sent();
                        if (member)
                            return [2 /*return*/, member];
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ClientUtil.prototype.getRole = function (message, arg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (message.mentions.roles.size !== 0)
                    return [2 /*return*/, message.mentions.roles.first()];
                if (/[0-9]{16,18}/.test(arg))
                    return [2 /*return*/, message.guild.roles.fetch(arg)];
                arg = arg.toLowerCase();
                if (/[a-zA-Z]{1,30}/)
                    return [2 /*return*/, message.guild.roles.cache.find(function (role) { return role.name.toLowerCase().includes(arg); })];
                return [2 /*return*/, null];
            });
        });
    };
    ClientUtil.prototype.getChannel = function (message, arg, textOnly) {
        if (textOnly === void 0) { textOnly = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (message.mentions.channels.size !== 0)
                    return [2 /*return*/, message.mentions.channels.first()];
                if (/[0-9]{16,18}/.test(arg))
                    return [2 /*return*/, message.guild.channels.cache.get(arg)];
                arg = arg.toLowerCase();
                if (/[a-zA-Z]{1,30}/)
                    return [2 /*return*/, message.guild.channels.cache.find(function (channel) {
                            if (textOnly && channel.type !== 'text')
                                return;
                            return channel.name.toLowerCase().includes(arg);
                        })];
                return [2 /*return*/, null];
            });
        });
    };
    ClientUtil.prototype.getGuild = function (arg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (/[0-9]{16,18}/.test(arg))
                    return [2 /*return*/, this.client.guilds.cache.get(arg)];
                arg = arg.toLowerCase();
                if (/[a-zA-Z]{1,30}/)
                    return [2 /*return*/, this.client.guilds.cache.find(function (guild) { return guild.name.toLowerCase().includes(arg); })];
                return [2 /*return*/, null];
            });
        });
    };
    return ClientUtil;
}());
exports.ClientUtil = ClientUtil;
