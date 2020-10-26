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
// dave caruso 2020-03-17, updated to ts 2020-04-22
var dom_parser_1 = require("dom-parser");
var node_cache_1 = require("node-cache");
var node_fetch_1 = require("node-fetch");
var parser = new dom_parser_1["default"]();
// two hour cache
var cache = new node_cache_1["default"]({ stdTTL: 60 * 60 * 2 });
var BM_BASE_URL = 'https://www.blackmagicdesign.com';
var BM_VERSION_LIST = '/support/partial/downloads';
function crawl() {
    return __awaiter(this, void 0, void 0, function () {
        var text, dom, versionNodes, transformedVersionNodes, latestFusion, latestResolve, visibleFusionMajor, visibleResolveMajor, fusionVersions, resolveVersions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"](BM_BASE_URL + BM_VERSION_LIST).then(function (response) { return response.text(); })];
                case 1:
                    text = _a.sent();
                    dom = parser.parseFromString(text);
                    versionNodes = dom
                        .getElementsByTagName('article')
                        // remove non resolve and non-fusion stuff
                        .filter(function (x) { return x.getAttribute('families') === 'davinci-resolve-and-fusion'; })
                        // remove fusion connect downloads
                        .filter(function (x) { return !x.getElementsByTagName('h4')[0].innerHTML.includes('Fusion Connect'); })
                        // remove fairlight sound pack downloads
                        .filter(function (x) { return !x.getElementsByTagName('h4')[0].innerHTML.includes('Fairlight Sound'); })
                        // remove eGPU downloads
                        .filter(function (x) { return !x.getElementsByTagName('h4')[0].innerHTML.includes('eGPU'); });
                    transformedVersionNodes = versionNodes.map(function (rootNode) {
                        // grab title, it is used a lot here.
                        var title = rootNode.getElementsByTagName('h4')[0].innerHTML;
                        // date is a <p>
                        var date = rootNode.getElementsByClassName('date')[0].innerHTML;
                        // the description is a <p> with two elements
                        var description = rootNode.getElementsByClassName('description')[0];
                        var shortDescription = description.getElementsByTagName('span')[0].innerHTML;
                        var readMore = description.getElementsByTagName('a')[0];
                        var readMoreURL = readMore ? BM_BASE_URL + readMore.getAttribute('href') : null;
                        // get program name, version, and studio version
                        var type = title.includes('Fusion') ? 'fusion' : 'resolve';
                        var version = title.match(/ ([0-9.]+)/)[1];
                        var studio = title.includes('Studio');
                        // downloads are <a> tags in the second <div class="group">
                        var downloadsRootNode = rootNode.getElementsByClassName('group')[1];
                        // assemble the download links
                        var downloads = downloadsRootNode.getElementsByTagName('a').reduce(function (obj, node) {
                            var platform = node.getAttribute('class').split(' ')[1];
                            var url = BM_BASE_URL + node.getAttribute('href');
                            obj[platform] = encodeURI(url);
                            return obj;
                        }, {});
                        var filteredDesc = shortDescription
                            .replace(/  +/g, ' ')
                            .replace('Technical support for the free version of DaVinci Resolve 16 is only available via the Blackmagic Design community forums.', '')
                            .split('')
                            .reverse()
                            .join('')
                            .replace(/^.* elgnod .*? \./, '.')
                            .split('')
                            .reverse()
                            .join('');
                        return {
                            type: type,
                            version: version,
                            date: date,
                            shortDescription: filteredDesc,
                            readMoreURL: readMoreURL,
                            studio: studio,
                            downloads: downloads
                        };
                    });
                    latestFusion = transformedVersionNodes.find(function (x) { return x.type === 'fusion'; }).version;
                    latestResolve = transformedVersionNodes.find(function (x) { return x.type === 'resolve'; }).version;
                    visibleFusionMajor = [latestFusion.split('.')[0], null];
                    visibleResolveMajor = [latestResolve.split('.')[0], null];
                    fusionVersions = new Map();
                    resolveVersions = new Map();
                    transformedVersionNodes.forEach(function (release) {
                        var obj = release.type === 'fusion' ? fusionVersions : resolveVersions;
                        var visibleMajors = release.type === 'fusion' ? visibleFusionMajor : visibleResolveMajor;
                        if (!obj.has(release.version)) {
                            var isVisible = visibleMajors.includes(release.version.split('.')[0]);
                            if (!isVisible && !visibleMajors[1]) {
                                visibleMajors[1] = release.version.split('.')[0];
                                isVisible = true;
                            }
                            // copy all the alike metadata
                            obj.set(release.version, {
                                visible: isVisible,
                                date: release.date,
                                version: release.version,
                                shortDescription: release.shortDescription,
                                readMoreURL: release.readMoreURL,
                                downloads: {
                                    studio: null,
                                    free: null
                                }
                            });
                        }
                        var mapped = obj.get(release.version);
                        mapped.downloads[release.studio ? 'studio' : 'free'] = release.downloads;
                        if (release.studio) {
                            mapped.readMoreURL = release.readMoreURL;
                        }
                    });
                    return [2 /*return*/, {
                            fusion: {
                                latest: latestFusion,
                                versions: Array.from(fusionVersions.values())
                            },
                            resolve: {
                                latest: latestResolve,
                                versions: Array.from(resolveVersions.values())
                            }
                        }];
            }
        });
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cache.has('data')) {
                        return [2 /*return*/, cache.get('data')];
                    }
                    return [4 /*yield*/, crawl()];
                case 1:
                    data = _a.sent();
                    cache.set('data', data);
                    return [2 /*return*/, data];
            }
        });
    });
}
exports["default"] = getData;
