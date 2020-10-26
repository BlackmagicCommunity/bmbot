"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var util_1 = require("./util");
dotenv_1.config();
// needs to be loaded before client is created
var web_crawler_1 = require("./commands/software/web-crawler");
require("./util/extensions/Guild");
require("./util/extensions/Message");
require("./util/extensions/Role");
require("./util/extensions/User");
web_crawler_1["default"]().then(function (data) {
    new util_1.Client({
        partials: ['REACTION'],
        disableMentions: 'everyone',
        presence: {
            activity: { name: "DaVinci Resolve " + data.resolve.latest, type: 'PLAYING' }
        },
        codeBaseDir: __dirname
    }).start();
});
