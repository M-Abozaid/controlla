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
var getYTVideos_1 = require("../common/getYTVideos");
var saveVisit_1 = require("../common/saveVisit");
var storage_1 = require("../common/storage");
var keeper_1 = require("./keeper");
var uuid_1 = require("uuid");
var Tracker = /** @class */ (function () {
    function Tracker() {
    }
    Tracker.prototype.handleTabRemoved = function (tabId) {
        return __awaiter(this, void 0, void 0, function () {
            var openVisit, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('%ctracker.ts line:10 object', 'color: #007acc;');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        openVisit = storage_1["default"].getOpenVisit(tabId);
                        console.log('%ctracker.ts line:13 object', 'color: #007acc;');
                        if (!openVisit) return [3 /*break*/, 4];
                        return [4 /*yield*/, storage_1["default"].closeOpenVisit(openVisit)];
                    case 2:
                        _a.sent();
                        openVisit.leftTime = new Date();
                        console.log('%ctracker.ts line:17 object', 'color: #007acc;');
                        return [4 /*yield*/, saveVisit_1["default"](openVisit)];
                    case 3:
                        _a.sent();
                        console.log('%ctracker.ts line:19 object', 'color: #007acc;');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
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
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { return __awaiter(_this, void 0, void 0, function () {
            var openVisit, vidId, openVisitVideoID, newVisit, vidId, ytDetails;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // const openVisit = visits.find(v => {
                        //   return v.tabId === tabId && v.leftTime === undefined;
                        // });
                        // console.log("CHANGE ", changeInfo.status)
                        console.log('%ctracker.ts line:36 changeInfo', 'color: #007acc;', changeInfo.status, changeInfo.url, changeInfo);
                        openVisit = storage_1["default"].getOpenVisit(tabId);
                        if (openVisit) {
                            console.log('openvisit ', openVisit.url, openVisit.status);
                            if (tab.url.includes('youtube.com/watch?v=')) {
                                vidId = tab.url.match(/watch\?v=(.{11})/)[1];
                                if (openVisit.url.includes('youtube.com/watch?v=')) {
                                    openVisitVideoID = openVisit.url.match(/watch\?v=(.{11})/)[1];
                                    if (vidId === openVisitVideoID) {
                                        console.log('same video ');
                                        return [2 /*return*/];
                                    }
                                }
                            }
                        }
                        if (!(changeInfo.status === 'loading' && changeInfo.url && changeInfo.url.indexOf('http') === 0)) return [3 /*break*/, 7];
                        newVisit = {
                            visitTime: new Date(),
                            tabId: tabId,
                            url: tab.url,
                            title: tab.title,
                            audible: false,
                            visibility: [],
                            click: [],
                            keypress: [],
                            audibleState: [],
                            _id: uuid_1.v4(),
                            status: 'loading'
                        };
                        if (!!openVisit) return [3 /*break*/, 4];
                        console.log('Create new visit');
                        storage_1["default"].createVisit(newVisit);
                        if (!tab.url.includes('youtube.com/watch?v=')) return [3 /*break*/, 2];
                        vidId = tab.url.match(/watch\?v=(.{11})/)[1];
                        return [4 /*yield*/, getYTVideos_1["default"]([vidId])];
                    case 1:
                        ytDetails = _a.sent();
                        newVisit.ytDetails = ytDetails.items[0];
                        newVisit.ytVideoId = vidId;
                        _a.label = 2;
                    case 2: return [4 /*yield*/, keeper_1["default"].controlTab(tab, false)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        // if openvisit and openvisit is loading do nothing;
                        if (openVisit && openVisit.status === 'loading') {
                            console.log('Do nothing');
                            return [2 /*return*/];
                        }
                        if (!(openVisit && openVisit.status === 'complete')) return [3 /*break*/, 6];
                        console.log('close previous ', openVisit);
                        return [4 /*yield*/, storage_1["default"].closeOpenVisit(openVisit)];
                    case 5:
                        _a.sent();
                        openVisit.leftTime = new Date();
                        saveVisit_1["default"](openVisit);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        if (changeInfo.title || changeInfo.audible || changeInfo.status === 'complete') {
                            if (openVisit) {
                                if (changeInfo.title) {
                                    openVisit.title = changeInfo.title;
                                }
                                if (changeInfo.audible) {
                                    openVisit.audible = true;
                                }
                                if (Object.prototype.hasOwnProperty.call(changeInfo, 'audible')) {
                                    openVisit.audibleState.push({
                                        time: new Date(),
                                        audible: changeInfo.audible
                                    });
                                }
                                if (changeInfo.status === 'complete') {
                                    console.log('complete visit', openVisit.url, openVisit.status);
                                    openVisit.status = 'complete';
                                    openVisit.audible = tab.audible;
                                    try {
                                        chrome.tabs.sendMessage(tabId, {
                                            hidden: 'hidden'
                                        }, function (response) {
                                            if (!window.chrome.runtime.lastError) {
                                                if (response && openVisit.url === response.href) {
                                                    if (response.hidden !== undefined) {
                                                        openVisit.visibility.push({
                                                            time: new Date(),
                                                            hidden: response.hidden,
                                                            focus: response.focus
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    catch (error) {
                                        console.error(error);
                                    }
                                }
                            }
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            // const openVisit = visits.find(v => {
            //     return v.tabId === sender.tab.id && v.leftTime === undefined;
            // });
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
                if (openVisit && (request.hidden !== undefined)) {
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
                    storage_1["default"].updateVisit(openVisit).then(function (r) {
                        console.log('Visit updated ');
                    });
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
    return Tracker;
}());
var tracker = new Tracker();
exports["default"] = tracker;
