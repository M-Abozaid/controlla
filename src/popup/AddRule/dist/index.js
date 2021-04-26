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
exports.__esModule = true;
var react_1 = require("react");
require("./styles.scss");
var types_1 = require("../../types");
var storage_1 = require("../../common/storage");
var react_time_range_slider_1 = require("react-time-range-slider");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var Select_1 = require("@material-ui/core/Select");
var SelectYTCat_1 = require("./SelectYTCat");
var react_bootstrap_1 = require("react-bootstrap");
var Services_1 = require("../Services");
var moment_1 = require("moment");
var AddRule = function (_a) {
    var onRuleAdded = _a.onRuleAdded, onHide = _a.onHide;
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
                            setMatcherValue(Services_1.escapeRegExp(firstActiveTabUrl));
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
    // matcher type and handler
    var _c = react_1["default"].useState(types_1.MatcherType.URL), matcherType = _c[0], setmatcherType = _c[1];
    var handleMatcherChange = function (event) {
        var newMatcher = event.target.value;
        setmatcherType(newMatcher);
        if (newMatcher === types_1.MatcherType.URL) {
            setShowYTCategory(false);
            setMatcherValue(escapedActiveTab);
        }
        else if (newMatcher === types_1.MatcherType.YT_CATEGORY)
            setShowYTCategory(true);
        else {
            setShowYTCategory(false);
            setMatcherValue('');
        }
    };
    // matcher value and show yt category
    var _d = react_1.useState(''), matcherValue = _d[0], setMatcherValue = _d[1];
    var _e = react_1.useState(false), showYTCategory = _e[0], setShowYTCategory = _e[1];
    // submitting the from
    var _f = react_1.useState(false), submittingFrom = _f[0], setSubmittingFrom = _f[1];
    // time input control
    var timeRangeInitial = {
        start: '00:00',
        end: '23:59'
    };
    var _g = react_1.useState(__assign({}, timeRangeInitial)), timeRange = _g[0], setTimeRange = _g[1];
    var start = timeRange.start, end = timeRange.end;
    var quotaTimeInitial = { activeQuota: '', visibilityQuota: '' };
    var _h = react_1.useState(quotaTimeInitial), quotaTime = _h[0], setQuotaTime = _h[1];
    var activeQuota = quotaTime.activeQuota, visibilityQuota = quotaTime.visibilityQuota;
    var handleQuotaChange = function (e) {
        var _a;
        return setQuotaTime(__assign(__assign({}, quotaTime), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
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
    var _j = react_1.useState(initialDaysOfWeek), daysOfWeek = _j[0], setDaysOfWeek = _j[1];
    var _k = react_1.useState(false), allWeekOn = _k[0], setAllWeekOn = _k[1];
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
    // form validation
    var addButtonTarget = react_1.useRef(null);
    var _l = react_1.useState(false), showOverlay = _l[0], setShowOverlay = _l[1];
    // form submittion
    var handleFormSubmitting = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var daysCount, startTimeParsed, endTimeParsed, convDaysOfWeek, convMatcherValue;
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
                    convMatcherValue = matcherType === types_1.MatcherType.URL
                        ? new RegExp(matcherValue)
                        : matcherValue;
                    return [4 /*yield*/, storage_1["default"].createRule({
                            matcher: {
                                type: matcherType,
                                value: convMatcherValue
                            },
                            daysOfWeek: convDaysOfWeek,
                            startTime: start,
                            endTime: end,
                            activeQuota: parseInt(activeQuota, 10) * 60000,
                            visibilityQuota: parseInt(visibilityQuota, 10) * 60000
                        })];
                case 3:
                    _a.sent();
                    onHide();
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
        react_1["default"].createElement(react_bootstrap_1.Modal, { size: 'lg', show: true, centered: true, onHide: onHide, "aria-labelledby": 'contained-modal-title-vcenter' },
            react_1["default"].createElement(react_bootstrap_1.Modal.Header, { className: 'modal__header', closeButton: true },
                react_1["default"].createElement(react_bootstrap_1.Modal.Title, { id: 'contained-modal-title-vcenter' }, "Add Rule")),
            react_1["default"].createElement(react_bootstrap_1.Modal.Body, null,
                react_1["default"].createElement(react_bootstrap_1.Form, { className: 'add-rule__form', onSubmit: function (e) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, handleFormSubmitting(e)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); } },
                    react_1["default"].createElement("div", { className: 'matcher-type__main' },
                        react_1["default"].createElement("span", null, "Matcher Type"),
                        react_1["default"].createElement(Select_1["default"], { className: 'matcher-type__select', labelId: 'select-label', value: matcherType, onChange: handleMatcherChange }, Object.keys(types_1.MatcherType).map(function (matcher) { return (react_1["default"].createElement(MenuItem_1["default"], { key: matcher, value: matcher }, matcher)); }))),
                    showYTCategory ? (react_1["default"].createElement(SelectYTCat_1["default"], { setMatcherValue: setMatcherValue })) : (react_1["default"].createElement(react_bootstrap_1.Form.Control, { className: 'macher-type__input', type: 'text', required: true, placeholder: 'Matcher Value', name: 'urlRegex', value: matcherValue, onChange: function (e) { return setMatcherValue(e.target.value); } })),
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
