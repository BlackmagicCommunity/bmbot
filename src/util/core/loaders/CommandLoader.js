"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var Command_1 = require("../../structures/command/Command");
var upperFirst = function (text) { return text.charAt(0).toUpperCase() + text.slice(1); };
exports["default"] = (function (client, path) {
    try {
        fs_1.readdirSync(path_1.resolve(path)).forEach(function (folder) {
            fs_1.readdirSync(path_1.resolve(path, folder))
                .filter(function (x) { return x.endsWith('js') || x.endsWith('ts'); })
                .forEach(function (file) {
                var commandFile = require(path_1.resolve(path, folder, file))["default"];
                if (!commandFile)
                    return;
                if (!(commandFile.prototype instanceof Command_1.Command))
                    return;
                var command = new commandFile(client);
                command.name = file.slice(0, -3);
                command.category = upperFirst(folder);
                client.commands.set(command.name, command);
            });
        });
    }
    catch (e) {
        console.log(e);
    }
});
