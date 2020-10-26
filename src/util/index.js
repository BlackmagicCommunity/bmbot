"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.Level = exports.Tag = exports.Event = exports.RunArguments = exports.Command = exports.Client = void 0;
var Client_1 = require("./core/Client");
__createBinding(exports, Client_1, "Client");
var Command_1 = require("./structures/command/Command");
__createBinding(exports, Command_1, "Command");
var RunArguments_1 = require("./structures/command/RunArguments");
__createBinding(exports, RunArguments_1, "RunArguments");
var Event_1 = require("./structures/Event");
__createBinding(exports, Event_1, "Event");
var Tag_1 = require("./structures/Tag");
__createBinding(exports, Tag_1, "Tag");
var Level_1 = require("./structures/Level");
__createBinding(exports, Level_1, "Level");
