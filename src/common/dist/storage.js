"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Rule_1 = require("./Rule");
var data_1 = require("./data");
var pouchdb_1 = require("pouchdb");
var pouchdb_find_1 = require("pouchdb-find");
var ruleMatcher_1 = require("./ruleMatcher");
var events_1 = require("events");
var moment_1 = require("moment");
pouchdb_1["default"].plugin(pouchdb_find_1["default"]);
// eslint-disable-next-line @typescript-eslint/ban-types
var Storage = /** @class */ (function (_super) {
    __extends(Storage, _super);
    function Storage() {
        var _this = _super.call(this) || this;
        _this.rulesDB = new pouchdb_1["default"]('rules');
        _this.quotaUsageDB = new pouchdb_1["default"]('quotaUsage');
        _this.visitsDB = new pouchdb_1["default"]('visits');
        _this.ytVideoURLRegex = /youtube.com\/watch\?v=/;
        _this.visits = [];
        _this.QUOTA_RENEWAL_HOUR = 17;
        return _this;
    }
    Storage.prototype.getRuleById = function (ruleId) {
        return __awaiter(this, void 0, Promise, function () {
            var ruleDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesDB.get(ruleId)];
                    case 1:
                        ruleDoc = _a.sent();
                        return [2 /*return*/, new Rule_1["default"](ruleDoc)];
                }
            });
        });
    };
    Storage.prototype.getRuleObjById = function (ruleId) {
        return __awaiter(this, void 0, Promise, function () {
            var ruleDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesDB.get(ruleId)];
                    case 1:
                        ruleDoc = _a.sent();
                        return [2 /*return*/, ruleDoc];
                }
            });
        });
    };
    Storage.prototype.getRules = function () {
        return __awaiter(this, void 0, Promise, function () {
            var dbResponse, rulesDocs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesDB.find({ selector: {} })];
                    case 1:
                        dbResponse = _a.sent();
                        rulesDocs = dbResponse.docs.filter(function (d) { return d.daysOfWeek; });
                        return [2 /*return*/, rulesDocs.map(function (r) { return new Rule_1["default"](r); })];
                }
            });
        });
    };
    Storage.prototype.updateRuleById = function (ruleId, ruleObj) {
        return this.updateOrCreateDoc(this.rulesDB, ruleObj, ruleId);
    };
    Storage.prototype.removeRule = function (ruleObj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesDB.remove(ruleObj)];
                    case 1:
                        _a.sent();
                        this.emit('rule_removed', ruleObj);
                        return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.createRule = function (rule) {
        return __awaiter(this, void 0, Promise, function () {
            var newRule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesDB.post(rule)];
                    case 1:
                        newRule = _a.sent();
                        this.emit('new_rule', newRule);
                        return [2 /*return*/, this.getRuleById(newRule.id)];
                }
            });
        });
    };
    /**
     * @param ruleId
     * returns the active usage for a given rule
     */
    Storage.prototype.getActiveUsage = function (ruleId) {
        return data_1.quotaUsage[0].activeUsage;
    };
    /**
     * @param ruleId string
     * returns the visibility usage for a given rule
     */
    Storage.prototype.getVisibilityUsage = function (ruleId) {
        return data_1.quotaUsage[0].activeUsage;
    };
    Storage.prototype.createUsage = function (usage, update) {
        return this.quotaUsageDB.put(usage);
    };
    Storage.prototype.getYTRules = function () {
        return data_1.rules.map(function (r) { return new Rule_1["default"](r); });
    };
    Storage.prototype.closeOpenVisit = function (visit) {
        var dbVisit = this.visits.find(function (v) { return v._id === visit._id; });
        dbVisit.leftTime = new Date();
        return dbVisit;
    };
    Storage.prototype.getOpenVisit = function (tabId) {
        try {
            var dbVisit = this.visits.find(function (v) {
                return v.tabId === tabId && !v.leftTime;
            });
            return dbVisit;
        }
        catch (error) {
            console.error('Error getting visit ' + String(tabId), error);
        }
    };
    Storage.prototype.createVisit = function (visit) {
        this.visits.push(visit);
        return visit;
    };
    // eslint-disable-next-line @typescript-eslint/require-await
    Storage.prototype.updateVisit = function (visit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('%cstorage.ts line:107 update visit', 'color: #007acc;', visit);
                return [2 /*return*/];
            });
        });
    };
    Storage.prototype.updateOrCreateDoc = function (db, fieldsToUpdate, _id) {
        return __awaiter(this, void 0, Promise, function () {
            var resp, doc, resp, updatedDoc, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!!_id) return [3 /*break*/, 2];
                        return [4 /*yield*/, db.post(fieldsToUpdate)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, db.get(resp.id)];
                    case 2: return [4 /*yield*/, db.get(_id)];
                    case 3:
                        doc = _a.sent();
                        if (!!doc) return [3 /*break*/, 5];
                        return [4 /*yield*/, db.post(fieldsToUpdate)];
                    case 4:
                        resp = _a.sent();
                        return [2 /*return*/, db.get(resp.id)];
                    case 5: return [4 /*yield*/, db.put(__assign(__assign({}, doc), fieldsToUpdate))];
                    case 6:
                        updatedDoc = _a.sent();
                        return [2 /*return*/, db.get(updatedDoc.id)];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Error updateOrCreateDoc', error_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.getMatchingRules = function (tab) {
        return __awaiter(this, void 0, Promise, function () {
            var allRules, visit_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRules()];
                    case 1:
                        allRules = _a.sent();
                        console.log('%cstorage.ts line:143 got all rules', 'color: #007acc;', tab, allRules);
                        if (this.ytVideoURLRegex.test(tab.url)) {
                            visit_1 = this.getOpenVisit(tab.id);
                            console.log('got open visit ', visit_1);
                            return [2 /*return*/, allRules.filter(function (rule) { return ruleMatcher_1["default"].matchTab(rule.ruleObj.matcher, tab, visit_1.ytDetails.snippet); })];
                        }
                        return [2 /*return*/, allRules.filter(function (rule) { return ruleMatcher_1["default"].matchURL(rule.ruleObj.matcher, tab); })];
                }
            });
        });
    };
    /**
     *
     * @param ruleId {string}
     * @param interval {number}
     *
     * Get a rule and interval and check if counting for today exists if so increment it if not create a new usage
     */
    Storage.prototype.incrementOrAddUsage = function (ruleId, interval) {
        return __awaiter(this, void 0, Promise, function () {
            var usage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getQuotaUsage(ruleId)];
                    case 1:
                        usage = _a.sent();
                        usage.activeUsage = usage.activeUsage + interval;
                        usage.visibilityUsage = usage.visibilityUsage + interval;
                        return [4 /*yield*/, this.quotaUsageDB.put(usage)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, usage];
                }
            });
        });
    };
    Storage.prototype.getQuotaUsage = function (ruleId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, usage, today, newUsage, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.quotaUsageDB.find({
                            selector: { ruleId: ruleId }
                        })];
                    case 1:
                        result = _a.sent();
                        usage = result.docs[0];
                        today = moment_1["default"]().format('DD-MM-YYYY');
                        if (!!usage) return [3 /*break*/, 3];
                        newUsage = {
                            ruleId: ruleId,
                            day: today,
                            activeUsage: 0,
                            visibilityUsage: 0
                        };
                        console.log('create new usage', result);
                        return [4 /*yield*/, this.quotaUsageDB.post(newUsage)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, this.quotaUsageDB.get(response.id)];
                    case 3:
                        if (!(usage.day !== today && moment_1["default"]().hour() >= this.QUOTA_RENEWAL_HOUR)) return [3 /*break*/, 5];
                        // update usage
                        usage.day = today;
                        usage.activeUsage = 0;
                        usage.visibilityUsage = 0;
                        return [4 /*yield*/, this.quotaUsageDB.put(usage)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, usage];
                    case 5: return [2 /*return*/, usage];
                }
            });
        });
    };
    Storage.prototype.init = function (scope) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rulesDB.createIndex({ index: { fields: ['matcher.type'] } })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.quotaUsageDB.createIndex({ index: { fields: ['ruleId'] } })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.visitsDB.createIndex({
                                index: { fields: ['tabId', 'leftTime', 'visitTime'] }
                            })];
                    case 3:
                        _a.sent();
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        window.rulesDB = this.rulesDB;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        window.visitsDB = this.visitsDB;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        window.quotaUsageDB = this.quotaUsageDB;
                        if (scope === 'popup') {
                            chrome.runtime.sendMessage({ message: 'getVisits' }, function (response) {
                                console.log('Got response ', response);
                                _this.visits = response.visits;
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Storage;
}(events_1.EventEmitter));
var storage = new Storage();
(window).storage = storage;
exports["default"] = storage;
