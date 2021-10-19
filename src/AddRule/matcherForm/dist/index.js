"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_bootstrap_1 = require("react-bootstrap");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var Select_1 = require("@material-ui/core/Select");
var types_1 = require("../../types");
var SelectYTCat_1 = require("../SelectYTCat");
var material_ui_chip_input_1 = require("material-ui-chip-input");
var MatcherForm = function (_a) {
    var matcher = _a.matcher, onMatcherUpdated = _a.onMatcherUpdated;
    console.log('matcher ', matcher);
    var _b = react_1["default"].useState(matcher.type || types_1.MatcherType.URL), type = _b[0], setMatcherType = _b[1];
    var _c = react_1.useState(matcher.value), value = _c[0], setMatcherValue = _c[1];
    var handleMatcherTypeChange = function (event) {
        var _a;
        var newMatcherType = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
        setMatcherType(newMatcherType);
        setMatcherValue(undefined);
        onMatcherUpdated({ type: newMatcherType, value: value });
    };
    var handleValueChange = function (newValue) {
        console.log('matcher value changed ', newValue);
        if (type === types_1.MatcherType.URL) {
            setMatcherValue(new RegExp(newValue));
        }
        else {
            setMatcherValue(newValue);
        }
        onMatcherUpdated({ type: type, value: newValue });
    };
    var getMatcherInput = function () {
        switch (type) {
            case types_1.MatcherType.YT_CATEGORY:
                return react_1["default"].createElement(SelectYTCat_1["default"], { setMatcherValue: handleValueChange });
            case types_1.MatcherType.YT_TAGS:
                return (react_1["default"].createElement(material_ui_chip_input_1["default"], { defaultValue: value || [], onChange: function (chips) { return handleValueChange(chips); } }));
            default:
                return (react_1["default"].createElement(react_bootstrap_1.Form.Control, { className: 'macher-type__input', type: 'text', required: true, placeholder: 'Matcher Value', name: 'urlRegex', value: value || '', onChange: function (evt) { return handleValueChange(evt.target.value); } }));
        }
    };
    return (react_1["default"].createElement("div", { className: 'add-rule__form' },
        react_1["default"].createElement("div", { className: 'matcher-type__main' },
            react_1["default"].createElement("span", null, "Matcher Type"),
            react_1["default"].createElement(Select_1["default"], { className: 'matcher-type__select', labelId: 'select-label', value: type, onChange: handleMatcherTypeChange }, Object.keys(types_1.MatcherType).map(function (mt) { return (react_1["default"].createElement(MenuItem_1["default"], { key: mt, value: mt }, mt)); }))),
        getMatcherInput()));
};
exports["default"] = MatcherForm;
