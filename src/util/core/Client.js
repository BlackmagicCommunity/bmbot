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
exports.Client = void 0;
var discord_js_1 = require("discord.js");
var path_1 = require("path");
var settings_1 = require("../../settings");
var database_1 = require("../database");
var CommandStore_1 = require("../stores/CommandStore");
var EventStore_1 = require("../stores/EventStore");
var Logger_1 = require("../structures/Logger");
var ClientUtil_1 = require("../utils/ClientUtil");
var CommandLoader_1 = require("./loaders/CommandLoader");
var EventLoader_1 = require("./loaders/EventLoader");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(clientOptions) {
        var _this = _super.call(this, clientOptions) || this;
        _this.commands = new CommandStore_1.CommandStore();
        _this.events = new EventStore_1.EventStore();
        _this.util = new ClientUtil_1.ClientUtil(_this);
        _this.invites = new discord_js_1.Collection();
        _this.logger = new Logger_1.Logger(_this);
        _this.database = new database_1.Database(_this);
        _this.settings = settings_1["default"];
        _this.codeBaseDir = clientOptions.codeBaseDir;
        return _this;
    }
    Client.prototype.start = function () {
        CommandLoader_1["default"](this, path_1["default"].join(this.codeBaseDir, 'commands'));
        EventLoader_1["default"](this, path_1["default"].join(this.codeBaseDir, 'events'));
        _super.prototype.login.call(this, process.env.TOKEN);
    };
    return Client;
}(discord_js_1.Client));
exports.Client = Client;
