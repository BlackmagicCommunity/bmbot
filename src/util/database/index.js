"use strict";
exports.__esModule = true;
exports.Tags = exports.Levels = exports.Database = void 0;
var sqlite3_1 = require("sqlite3");
var Levels_1 = require("./Levels");
exports.Levels = Levels_1["default"];
var Tags_1 = require("./Tags");
exports.Tags = Tags_1["default"];
var Database = /** @class */ (function () {
    function Database(client) {
        Object.defineProperty(this, 'client', { value: client });
        this.sqlite = new sqlite3_1.Database('./bmdbot.sqlite3');
        this.levels = new Levels_1["default"](client, this.sqlite);
        this.tags = new Tags_1["default"](client, this.sqlite);
        this._init();
    }
    Database.prototype._init = function () {
        var query = [
            'CREATE TABLE IF NOT EXISTS User (',
            'id TEXT PRIMARY KEY,',
            'msgCount INTEGER NOT NULL,',
            'totalXp INTEGER NOT NULL,',
            'currentXp INTEGER NOT NULL,',
            'level INTEGER NOT NULL',
            ');',
            'CREATE TABLE IF NOT EXISTS Role (',
            'id TEXT PRIMARY KEY,,',
            'single INTEGER NOT NULL,',
            'level INTEGER NOT NULL',
            ');',
            'CREATE TABLE IF NOT EXISTS Tag (',
            'name TEXT PRIMARY KEY,',
            'description TEXT,',
            'reply TEXT',
            ');',
        ];
        this.sqlite.run(query.join('\n'));
    };
    return Database;
}());
exports.Database = Database;
