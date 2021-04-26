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
exports.Keeper = void 0;
var storage_1 = require("../common/storage");
var chrome_promise_1 = require("chrome-promise");
var ruleMatcher_1 = require("../common/ruleMatcher");
var ytVideoURLRegex = /youtube.com\/watch\?v=/;
var TICK_LENGTH = 1000;
var Keeper = /** @class */ (function () {
    function Keeper() {
        var _this = this;
        this.controlTab = function (tab, shouldIncrementQuota) {
            if (shouldIncrementQuota === void 0) { shouldIncrementQuota = true; }
            return __awaiter(_this, void 0, Promise, function () {
                var rules, effectiveRules, matchingRules, visit_1, _a, tabExpired, visibilityExpired;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, storage_1["default"].getRules()];
                        case 1:
                            rules = _b.sent();
                            effectiveRules = rules.filter(function (r) { return r.isEffectiveNow(); });
                            matchingRules = [];
                            // if this is a youtube tab
                            if (ytVideoURLRegex.test(tab.url)) {
                                visit_1 = storage_1["default"].getOpenVisit(tab.id);
                                console.log('Visit ', visit_1);
                                if (!visit_1 || !visit_1.ytDetails) {
                                    return [2 /*return*/];
                                }
                                matchingRules = effectiveRules.filter(function (r) { return ruleMatcher_1["default"].matchTab(r.ruleObj.matcher, tab, visit_1.ytDetails.snippet); });
                            }
                            else {
                                matchingRules = effectiveRules.filter(function (r) { return ruleMatcher_1["default"].matchURL(r.ruleObj.matcher, tab); });
                            }
                            if (!shouldIncrementQuota) return [3 /*break*/, 3];
                            // update Quota
                            return [4 /*yield*/, this.incrementQuota(matchingRules)];
                        case 2:
                            // update Quota
                            _b.sent();
                            _b.label = 3;
                        case 3: return [4 /*yield*/, this.quotaCheck(matchingRules)];
                        case 4:
                            _a = _b.sent(), tabExpired = _a[0], visibilityExpired = _a[1];
                            if (tabExpired) {
                                this.hideTab(tab).then(function () {
                                    try {
                                        console.log('Tab expired ', matchingRules);
                                        _this.removeTab(tab);
                                    }
                                    catch (error) {
                                        console.error('Error Removing tab', error);
                                    }
                                })["catch"](function (error) {
                                    console.error(error);
                                });
                            }
                            else if (visibilityExpired) {
                                this.hideTab(tab);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.run = function () {
            try {
                chrome_promise_1["default"].tabs.query({ active: true }).then(function (activeTabs) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, activeTabs_1, tab, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _i = 0, activeTabs_1 = activeTabs;
                                _a.label = 1;
                            case 1:
                                if (!(_i < activeTabs_1.length)) return [3 /*break*/, 6];
                                tab = activeTabs_1[_i];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, this.controlTab(tab)];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                error_1 = _a.sent();
                                console.error(error_1);
                                return [3 /*break*/, 5];
                            case 5:
                                _i++;
                                return [3 /*break*/, 1];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); })["catch"](function (err) {
                    // eslint-disable-next-line no-console
                    console.error('error getting tabs ', err);
                });
            }
            catch (error) {
                console.error("Error running keeper", error);
            }
        };
    }
    Keeper.prototype.incrementQuota = function (rules) {
        return Promise.all(rules.map(function (rule) {
            return storage_1["default"].incrementOrAddUsage(rule._id, TICK_LENGTH);
        }));
    };
    Keeper.prototype.quotaCheck = function (rules) {
        return __awaiter(this, void 0, Promise, function () {
            var tabRemoved, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabRemoved = false;
                        result = [false, false];
                        return [4 /*yield*/, Promise.all(rules.map(function (rule) { return __awaiter(_this, void 0, void 0, function () {
                                var usage;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (tabRemoved)
                                                return [2 /*return*/];
                                            return [4 /*yield*/, storage_1["default"].getQuotaUsage(rule._id)];
                                        case 1:
                                            usage = _a.sent();
                                            if (tabRemoved)
                                                return [2 /*return*/];
                                            if (this.compareActiveQuota(usage, rule)) {
                                                result[0] = true;
                                                tabRemoved = true;
                                            }
                                            if (this.compareVisibilityQuota(usage, rule)) {
                                                result[1] = true;
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Keeper.prototype.compareActiveQuota = function (_a, _b) {
        var activeUsage = _a.activeUsage;
        var activeQuota = _b.ruleObj.activeQuota;
        return activeUsage >= activeQuota;
    };
    Keeper.prototype.compareVisibilityQuota = function (_a, _b) {
        var visibilityUsage = _a.visibilityUsage;
        var visibilityQuota = _b.ruleObj.visibilityQuota;
        return visibilityUsage >= visibilityQuota;
    };
    Keeper.prototype.removeTab = function (tab) {
        chrome.tabs.get(tab.id, function (tabFound) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }
            else {
                console.log('%ckeeper.ts line:129 tab', 'color: #007acc;', tab);
                if (tabFound) {
                    console.log('%ckeeper.ts line:131 remove tab', 'color: #007acc;', tabFound);
                    chrome.tabs.remove(tab.id, function (err) {
                        if (err)
                            console.error('Error removing tab', err);
                    });
                }
            }
        });
    };
    Keeper.prototype.hideTab = function (tab) {
        return __awaiter(this, void 0, Promise, function () {
            var newTab, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, chrome_promise_1["default"].tabs.query({
                                url: 'chrome://newtab/',
                                windowId: tab.windowId
                            })];
                    case 1:
                        newTab = (_a.sent())[0];
                        if (!newTab) return [3 /*break*/, 3];
                        return [4 /*yield*/, chrome_promise_1["default"].tabs.update(newTab.id, { active: true })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, chrome_promise_1["default"].tabs.create({ windowId: tab.windowId })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Error hiding tab', error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Keeper.prototype.isYTVideoAllowed = function (video) {
        return __awaiter(this, void 0, Promise, function () {
            var YTRules, matchingRules, disallowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1["default"].getRules()];
                    case 1:
                        YTRules = _a.sent();
                        matchingRules = YTRules.filter(function (rule) {
                            return (rule.isEffectiveNow() && ruleMatcher_1["default"].matchVideoSnippet(rule.ruleObj.matcher, video));
                        });
                        return [4 /*yield*/, this.quotaCheck(matchingRules)];
                    case 2:
                        disallowed = (_a.sent())[0];
                        return [2 /*return*/, !disallowed];
                }
            });
        });
    };
    return Keeper;
}());
exports.Keeper = Keeper;
var keeper = new Keeper();
window.keeper = keeper;
exports["default"] = keeper;
