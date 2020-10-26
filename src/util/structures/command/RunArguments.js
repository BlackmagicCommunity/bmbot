"use strict";
exports.__esModule = true;
exports.RunArguments = void 0;
exports.RunArguments = function (message, args) {
    return {
        args: args,
        guild: message.guild,
        message: message,
        msg: message,
        user: message.author
    };
};
