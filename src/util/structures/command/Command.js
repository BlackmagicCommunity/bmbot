"use strict";
exports.__esModule = true;
exports.Command = void 0;
var discord_js_1 = require("discord.js");
var path_1 = require("path");
var Command = /** @class */ (function () {
    function Command(client, options) {
        Object.defineProperty(this, 'client', { value: client });
        this.alias = false;
        this.aliases = options.aliases || [];
        this.deletable = options.deletable || false;
        this.disabled = options.disabled || false;
        this.hidden = options.hidden || false;
        this.help = options.help || 'Command goes brrrr';
        this.guildOnly = options.guildOnly || false;
        this.ownerOnly = options.ownerOnly || false;
        this.developerOnly = options.developerOnly || false;
        this.arguments = options.arguments || [];
        this.requiredPermissions = options.requiredPermissions || [];
        this.allowedChannels = options.allowedChannels || [];
        this.allowedRoles = options.allowedRoles || [];
        this.cooldown = options.cooldown || 0;
        this.cooldowns = this.cooldown !== 0 ? new discord_js_1.Collection() : null;
        this.usageCount = 0;
    }
    Command.prototype.hasPermission = function (message) {
        // Guild only
        if (message.channel.type === 'dm' && this.guildOnly)
            return false;
        if (this.client.util.isOwner(message.author.id))
            return true;
        if (this.ownerOnly)
            return false;
        if (this.developerOnly && !this.client.util.isDeveloper(message.author.id))
            return false;
        // Guild Permissions
        for (var _i = 0, _a = this.requiredPermissions; _i < _a.length; _i++) {
            var permission = _a[_i];
            if (!message.member.hasPermission(permission) || !message.guild.me.hasPermission(permission))
                return false;
        }
        // Allowed Channels
        if (this.allowedChannels.length !== 0) {
            var allowed = false;
            var _loop_1 = function (chnl) {
                var c = message.guild.channels.cache.find(function (a) { return a.type === 'text' && (a.name.toLowerCase().includes(chnl.toLowerCase()) || a.id === chnl); });
                if (c && message.channel.id) {
                    allowed = true;
                    return "break";
                }
            };
            for (var _b = 0, _c = this.allowedChannels; _b < _c.length; _b++) {
                var chnl = _c[_b];
                var state_1 = _loop_1(chnl);
                if (state_1 === "break")
                    break;
            }
            if (!allowed)
                return false;
        }
        // Allowed Roles
        if (this.allowedRoles.length !== 0) {
            var allowed = false;
            allowed = false;
            var _loop_2 = function (rol) {
                var r = message.guild.roles.cache.find(function (a) { return a.name.toLowerCase().includes(rol.toLowerCase()) || a.id === rol; });
                if (r && message.member.roles.cache.has(r.id)) {
                    allowed = true;
                    return "break";
                }
            };
            for (var _d = 0, _e = this.allowedRoles; _d < _e.length; _d++) {
                var rol = _e[_d];
                var state_2 = _loop_2(rol);
                if (state_2 === "break")
                    break;
            }
            if (!allowed)
                return false;
        }
        return true;
    };
    Command.prototype.helpMessage = function (message, command) {
        if (command === void 0) { command = this; }
        var embed = new discord_js_1.MessageEmbed().setTitle(message.client.user.username + "'s Commands").setColor(this.client.settings.colors.info);
        embed.setDescription(command.help).addField('Command', command.name + " (" + command.category + ")", true);
        if (command.guildOnly)
            embed.addField('Guild Only', 'Yes', true);
        if (command.aliases.length !== 0)
            embed.addField('Aliases', "`" + command.aliases.join('`, `') + "`", true);
        if (command.arguments.length !== 0)
            embed.addField('Usage', "" + message.prefix + command.name + " " + command.arguments.map(function (a) { return "" + (a.required ? '<' : '[') + a.name + (a.required ? '>' : ']'); }).join(' '));
        if (command.ownerOnly || command.developerOnly)
            embed.addField('Developer Only', 'Yes');
        if (command.requiredPermissions.length !== 0)
            embed.addField('Required Permissions', "`" + command.requiredPermissions.join('`, `') + "`");
        if (command.allowedRoles.length !== 0)
            embed.addField('Allowed Roles', "`" + command.allowedRoles.join('`, `') + "`");
        if (command.allowedChannels.length !== 0)
            embed.addField('Allowed Channels', "`" + command.allowedChannels.join('`, `') + "`");
        return embed;
    };
    Command.prototype.handleCommand = function (runArguments) {
        var _this = this;
        if (runArguments.message.command.disabled)
            return;
        if (!runArguments.message.command.hasPermission(runArguments.message))
            return runArguments.message.react('❌');
        if (this.cooldown !== 0) {
            var cooldown = this.cooldowns.get(runArguments.user.id);
            if (cooldown)
                return runArguments.message.channel.send(":clock1: Way too fast! Wait `" + ((cooldown - Date.now()) / 1000).toFixed(2) + "` seconds to continue.");
            else {
                this.cooldowns.set(runArguments.user.id, Date.now() + this.cooldown * 1000);
                this.client.setTimeout(function () { return _this.cooldowns["delete"](runArguments.user.id); }, this.cooldown * 1000);
            }
        }
        if (runArguments.args.length < this.arguments.length && this.arguments.reduce(function (acc, a) { return (a.required ? acc + 1 : acc); }, 0) !== 0)
            return runArguments.message.channel.send(this.helpMessage(runArguments.message));
        this.usageCount++;
        this.main(runArguments);
        if (this.deletable && runArguments.message.deletable)
            runArguments.message["delete"]();
    };
    Command.prototype.main = function (runArguments) {
        return true;
    };
    Command.prototype.reload = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                delete require.cache[require.resolve(path_1.resolve('src', 'commands', _this.category, _this.name))];
                var commandFile = require(path_1.resolve('src', 'commands', _this.category, _this.name))["default"];
                var command = new commandFile(_this.client);
                _this.client.commands["delete"](_this.name);
                _this.client.commands.set(command.name, command);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return Command;
}());
exports.Command = Command;
