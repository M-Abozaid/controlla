"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
require("./styles.scss");
var storage_1 = require("../common/storage");
var react_time_range_slider_1 = require("react-time-range-slider");
var react_bootstrap_1 = require("react-bootstrap");
var Services_1 = require("../popup/Services");
var moment_1 = require("moment");
var matcherForm_1 = require("./matcherForm");
var types_1 = require("../types");
var icons_1 = require("@material-ui/icons");
var core_1 = require("@material-ui/core");
var AddRule = function (_a) {
    var onRuleAdded = _a.onRuleAdded;
    react_1.useEffect(function () {
        function getActiveTabAsync() {
            return __awaiter(this, void 0, void 0, function () {
                var activeTab, firstActiveTabUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Services_1.getActiveTab()];
                        case 1:
                            activeTab = (_a.sent())[0];
                            firstActiveTabUrl = Services_1.extractHostname(activeTab.url);
                            setActiveTabUrl(firstActiveTabUrl);
                            console.log('Set matchers ', firstActiveTabUrl);
                            setMatchers([
                                {
                                    type: types_1.MatcherType.URL,
                                    value: new RegExp(Services_1.escapeRegExp(firstActiveTabUrl))
                                },
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        }
        getActiveTabAsync();
    }, []);
    // active tab url
    var _b = react_1.useState(''), activeTabUrl = _b[0], setActiveTabUrl = _b[1];
    var escapedActiveTab = Services_1.escapeRegExp(activeTabUrl);
    var _c = react_1.useState([]), matchers = _c[0], setMatchers = _c[1];
    // submitting the from
    var _d = react_1.useState(false), submittingFrom = _d[0], setSubmittingFrom = _d[1];
    // time input control
    var timeRangeInitial = {
        start: '00:00',
        end: '23:59'
    };
    var _e = react_1.useState(__assign({}, timeRangeInitial)), timeRange = _e[0], setTimeRange = _e[1];
    var start = timeRange.start, end = timeRange.end;
    var quotaTimeInitial = { activeQuota: '', visibilityQuota: '' };
    var _f = react_1.useState(quotaTimeInitial), quotaTime = _f[0], setQuotaTime = _f[1];
    var activeQuota = quotaTime.activeQuota, visibilityQuota = quotaTime.visibilityQuota;
    var handleQuotaChange = function (e) {
        var _a;
        return setQuotaTime(__assign(__assign({}, quotaTime), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    var _g = react_1.useState(1), priority = _g[0], setPriority = _g[1];
    // days of the week
    var initialDaysOfWeek = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false
    };
    var allDaysOfWeekOn = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true
    };
    var _h = react_1.useState(initialDaysOfWeek), daysOfWeek = _h[0], setDaysOfWeek = _h[1];
    var _j = react_1.useState(false), allWeekOn = _j[0], setAllWeekOn = _j[1];
    var handleAllWeek = function () {
        if (allWeekOn) {
            setDaysOfWeek(initialDaysOfWeek);
            setAllWeekOn(false);
        }
        else {
            setDaysOfWeek(allDaysOfWeekOn);
            setAllWeekOn(true);
        }
    };
    var updateMatcher = function (update, i) {
        console.log('update matcher ', update, i);
        matchers[i] = __assign(__assign({}, matchers[i]), update);
        setMatchers(__spreadArrays(matchers));
    };
    var addMatcher = function () {
        setMatchers(__spreadArrays(matchers, [
            { type: types_1.MatcherType.URL, value: new RegExp(escapedActiveTab) },
        ]));
    };
    // form validation
    var addButtonTarget = react_1.useRef(null);
    var _k = react_1.useState(false), showOverlay = _k[0], setShowOverlay = _k[1];
    // form submittion
    var handleFormSubmitting = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var daysCount, startTimeParsed, endTimeParsed, convDaysOfWeek;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    daysCount = 0;
                    startTimeParsed = parseInt(start.substring(0, 2), 10);
                    endTimeParsed = parseInt(end.substring(0, 2), 10);
                    Object.keys(daysOfWeek).map(function (day) { return !daysOfWeek[day] && daysCount++; });
                    if (!(daysCount === 7)) return [3 /*break*/, 1];
                    if (!showOverlay) {
                        setShowOverlay(true);
                    }
                    setTimeout(function () { return !showOverlay && setShowOverlay(false); }, 2000);
                    return [3 /*break*/, 4];
                case 1:
                    if (!(startTimeParsed > endTimeParsed)) return [3 /*break*/, 2];
                    if (!showOverlay) {
                        setShowOverlay(true);
                    }
                    setTimeout(function () { return !showOverlay && setShowOverlay(false); }, 2000);
                    return [3 /*break*/, 4];
                case 2:
                    setSubmittingFrom(true);
                    convDaysOfWeek = Object.keys(daysOfWeek).map(function (day) {
                        if (daysOfWeek[day])
                            return parseInt(day, 10);
                    });
                    console.log('create rule ', matchers);
                    return [4 /*yield*/, storage_1["default"].createRule({
                            matchers: matchers,
                            daysOfWeek: convDaysOfWeek,
                            startTime: start,
                            endTime: end,
                            activeQuota: parseInt(activeQuota, 10) * 60000,
                            visibilityQuota: parseInt(visibilityQuota, 10) * 60000,
                            priority: priority
                        })];
                case 3:
                    _a.sent();
                    onRuleAdded();
                    setSubmittingFrom(false);
                    setQuotaTime(quotaTimeInitial);
                    setDaysOfWeek(initialDaysOfWeek);
                    setTimeRange(__assign({}, timeRangeInitial));
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(core_1.Grid, { container: true, direction: 'row', spacing: 2 },
            react_1["default"].createElement(core_1.Grid, { item: true, xs: 12 },
                react_1["default"].createElement("h2", null, "Add Rule."),
                react_1["default"].createElement(react_bootstrap_1.Form, { className: 'add-rule__form', onSubmit: function (e) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, handleFormSubmitting(e)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); } },
                    react_1["default"].createElement(core_1.Grid, null,
                        react_1["default"].createElement(react_bootstrap_1.Form.Control, { required: true, min: '1', type: 'number', placeholder: 'Priority', name: 'priority', value: priority.toString(), 
                            // eslint-disable-next-line radix
                            onChange: function (e) { return setPriority(parseInt(e.target.value)); } })),
                    matchers.map(function (matcher, i) { return (react_1["default"].createElement(matcherForm_1["default"], { key: i, matcher: matcher, onMatcherUpdated: function (update) { return updateMatcher(update, i); } })); }),
                    react_1["default"].createElement(icons_1.Add, { onClick: function () { return addMatcher(); } }),
                    react_1["default"].createElement("div", { className: 'start-end__time' },
                        react_1["default"].createElement("span", null, timeRange.start),
                        react_1["default"].createElement("span", null, timeRange.end)),
                    react_1["default"].createElement("div", { className: 'time-range__slider' },
                        react_1["default"].createElement(react_time_range_slider_1["default"], { disabled: false, format: 24, maxValue: '23:59', minValue: '00:00', name: 'time_range', onChangeStart: console.log, onChangeComplete: console.log, onChange: setTimeRange, step: 5, value: timeRange })),
                    react_1["default"].createElement("div", { className: 'quota__time-gruop' },
                        react_1["default"].createElement(react_bootstrap_1.Form.Control, { required: true, min: '0', type: 'number', placeholder: 'Active Quota', name: 'activeQuota', value: activeQuota, onChange: function (e) { return handleQuotaChange(e); } }),
                        react_1["default"].createElement(react_bootstrap_1.Form.Control, { required: true, min: '0', type: 'number', placeholder: 'Visibility Quota', name: 'visibilityQuota', value: visibilityQuota, onChange: function (e) { return handleQuotaChange(e); } })),
                    react_1["default"].createElement(react_bootstrap_1.ButtonGroup, { className: 'week__button-group', "aria-label": 'button-group' },
                        Object.keys(daysOfWeek).map(function (num, idx) { return (react_1["default"].createElement(react_bootstrap_1.Button, { key: idx, variant: daysOfWeek[num] ? 'primary' : 'light', onClick: function () {
                                var _a;
                                return setDaysOfWeek(__assign(__assign({}, daysOfWeek), (_a = {}, _a[num] = !daysOfWeek[num], _a)));
                            } }, moment_1["default"](parseInt(num, 10), 'd').format('dd'))); }),
                        react_1["default"].createElement(react_bootstrap_1.Button, { style: { marginLeft: '5px' }, variant: allWeekOn ? 'outline-secondary' : 'primary', onClick: handleAllWeek }, allWeekOn ? '-' : '+')),
                    react_1["default"].createElement(react_bootstrap_1.Button, { className: 'submit__button', variant: 'danger', type: 'submit', block: true, ref: addButtonTarget }, submittingFrom ? (react_1["default"].createElement(react_bootstrap_1.Spinner, { as: 'span', animation: 'border', size: 'sm', role: 'status', "aria-hidden": 'true' })) : (react_1["default"].createElement("span", null, "Submit"))),
                    react_1["default"].createElement(react_bootstrap_1.Overlay, { target: addButtonTarget.current, show: showOverlay, placement: 'top' },
                        react_1["default"].createElement(react_bootstrap_1.Tooltip, { id: 'overlay' }, "You have to choose at least one day")))))));
};
exports["default"] = AddRule;
