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
var storage_1 = require("../common/storage");
var keeper_1 = require("./keeper");
var await_lock_1 = require("await-lock");
var Tracker = /** @class */ (function () {
    function Tracker() {
        this.lock = new await_lock_1["default"]();
    }
    Tracker.prototype.handleTabRemoved = function (tabId) {
        return __awaiter(this, void 0, void 0, function () {
            var openVisit, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        openVisit = storage_1["default"].getOpenVisit(tabId);
                        if (!openVisit) return [3 /*break*/, 2];
                        return [4 /*yield*/, storage_1["default"].closeOpenVisit(openVisit)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tracker.prototype.run = function () {
        var _this = this;
        chrome.tabs.onRemoved.addListener(function (tabId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handleTabRemoved(tabId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        chrome.tabs.onUpdated.addListener(function (tabId, _a, tab) {
            var _b = _a === void 0 ? {} : _a, status = _b.status, url = _b.url, title = _b.title, audible = _b.audible;
            return __awaiter(_this, void 0, void 0, function () {
                var openVisit_1, visit, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.lock.acquireAsync()];
                        case 1:
                            _c.sent();
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 10, 11, 12]);
                            openVisit_1 = storage_1["default"].getOpenVisit(tabId);
                            if (!(status === 'loading' && url && url.indexOf('http') === 0)) return [3 /*break*/, 9];
                            if (!!openVisit_1) return [3 /*break*/, 5];
                            return [4 /*yield*/, storage_1["default"].createVisitFromTab(tab)];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, keeper_1["default"].controlTab(tab, false)];
                        case 4:
                            _c.sent();
                            return [3 /*break*/, 9];
                        case 5:
                            // if the url is the same do nothing
                            if (this.isUrlTheSame(openVisit_1.url, url)) {
                                console.log('TAB CHANGE same video ');
                                return [2 /*return*/];
                            }
                            // else url is different from openVisit close openVisit
                            return [4 /*yield*/, storage_1["default"].closeOpenVisit(openVisit_1)
                                // create new
                            ];
                        case 6:
                            // else url is different from openVisit close openVisit
                            _c.sent();
                            return [4 /*yield*/, storage_1["default"].createVisitFromTab(tab)];
                        case 7:
                            visit = _c.sent();
                            return [4 /*yield*/, keeper_1["default"].controlTab(tab, false)];
                        case 8:
                            _c.sent();
                            _c.label = 9;
                        case 9:
                            if (openVisit_1) {
                                if (title) {
                                    openVisit_1.title = title;
                                }
                                if (audible) {
                                    openVisit_1.audible = true;
                                }
                                if (audible !== undefined) {
                                    console.log('audible state changed ', openVisit_1);
                                    openVisit_1.audibleState.push({
                                        time: new Date(),
                                        audible: audible
                                    });
                                }
                                if (status === 'complete') {
                                    openVisit_1.status = 'complete';
                                    chrome.tabs.sendMessage(tabId, {
                                        hidden: 'hidden'
                                    }, function (response) {
                                        if (!window.chrome.runtime.lastError) {
                                            if (response && openVisit_1.url === response.href) {
                                                if (response.hidden !== undefined) {
                                                    openVisit_1.visibility.push({
                                                        time: new Date(),
                                                        hidden: response.hidden,
                                                        focus: response.focus
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            return [3 /*break*/, 12];
                        case 10:
                            error_2 = _c.sent();
                            console.error(error_2);
                            return [3 /*break*/, 12];
                        case 11:
                            this.lock.release();
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        });
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.msg === 'checkVideo') {
                keeper_1["default"].isYTVideoAllowed(request.snippet).then(function (allowVid) {
                    sendResponse({
                        allowVid: allowVid
                    });
                });
                return true;
            }
            else {
                if (request.message === 'getVisits') {
                    sendResponse({
                        visits: storage_1["default"].visits
                    });
                    return true;
                }
                var openVisit = storage_1["default"].getOpenVisit(sender.tab.id);
                // console.log("got event ", request, openVisit);
                if (openVisit && request.hidden !== undefined) {
                    openVisit.visibility.push({
                        time: new Date(),
                        hidden: request.hidden
                    });
                }
                if (openVisit && request.focus !== undefined) {
                    openVisit.visibility.push({
                        time: new Date(),
                        focus: request.focus
                    });
                }
                if (openVisit && request.message === 'keypress') {
                    openVisit.keypress.push({
                        time: new Date()
                    });
                }
                if (openVisit && request.message === 'click') {
                    openVisit.click.push({
                        time: new Date()
                    });
                }
                try {
                    storage_1["default"].updateVisit(openVisit).then();
                }
                catch (error) {
                    console.error(error);
                }
                sendResponse({
                    farewell: 'goodbye'
                });
            }
            return true;
        });
    };
    Tracker.prototype.isUrlTheSame = function (firstUrl, secondUrl) {
        if (firstUrl.includes('youtube.com/watch?v=') &&
            secondUrl.includes('youtube.com/watch?v=')) {
            return (firstUrl.match(/watch\?v=(.{11})/)[1] ===
                secondUrl.match(/watch\?v=(.{11})/)[1]);
        }
        else {
            return firstUrl === secondUrl;
        }
    };
    return Tracker;
}());
// some test coding
var tracker = new Tracker();
exports["default"] = tracker;
