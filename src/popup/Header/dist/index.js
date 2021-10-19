"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./styles.scss");
var icons_1 = require("@material-ui/icons");
var core_1 = require("@material-ui/core");
var storage_1 = require("../../common/storage");
var react_bootstrap_1 = require("react-bootstrap");
var settings_1 = require("../../common/settings");
var Header = function () {
    var _a = react_1.useState(false), showAddRuleModal = _a[0], toggleAddRuleModal = _a[1];
    var _b = react_1.useState(storage_1["default"].isControlPaused()), isControlPaused = _b[0], setIsControlPaused = _b[1];
    var _c = react_1.useState(true), isControlPauseAllowed = _c[0], setIsControlPauseAllowed = _c[1];
    var _d = react_1.useState(0), pauseUsagePercent = _d[0], setPauseUsagePercent = _d[1];
    var toggleIsControlPaused = function (evt) {
        if (!isControlPauseAllowed)
            return;
        if (storage_1["default"].isControlPaused()) {
            setIsControlPaused(false);
            storage_1["default"].resumeControl();
        }
        else {
            setIsControlPaused(true);
            storage_1["default"].pauseControl();
        }
    };
    var checkControlPausedUsage = function () {
        var controlUsage = storage_1["default"].getOrCreatePauseUsage();
        if (controlUsage.usage >= settings_1["default"].pauseQuota && isControlPauseAllowed) {
            setIsControlPauseAllowed(false);
        }
        else if (!isControlPauseAllowed) {
            setIsControlPauseAllowed(true);
        }
        setPauseUsagePercent((controlUsage.usage / settings_1["default"].pauseQuota) * 100);
        setIsControlPaused(storage_1["default"].isControlPaused());
    };
    react_1.useEffect(function () {
        checkControlPausedUsage();
        var intervalId = setInterval(checkControlPausedUsage, settings_1["default"].tickDuration);
        return function () { return clearInterval(intervalId); };
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "header__container " },
            react_1["default"].createElement("div", { className: "header__main black" },
                react_1["default"].createElement("div", { className: 'header__title' },
                    react_1["default"].createElement("span", null, "Controlla")),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("div", { className: 'header__button' },
                        react_1["default"].createElement(core_1.Tooltip, { TransitionComponent: core_1.Zoom, TransitionProps: { timeout: 300 }, title: 'Add Rule', arrow: true },
                            react_1["default"].createElement(icons_1.Add, { onClick: function () { return chrome.tabs.create({ url: '/add-rule.html' }); } }))),
                    react_1["default"].createElement("button", { className: 'header__button', onClick: toggleIsControlPaused, disabled: !isControlPauseAllowed },
                        react_1["default"].createElement(core_1.Tooltip, { TransitionComponent: core_1.Zoom, TransitionProps: { timeout: 300 }, title: 'Pause control', arrow: true }, isControlPaused ? react_1["default"].createElement(icons_1.PlayArrow, null) : react_1["default"].createElement(icons_1.Pause, null))),
                    react_1["default"].createElement("div", { className: 'header__button' },
                        react_1["default"].createElement(core_1.Tooltip, { TransitionComponent: core_1.Zoom, TransitionProps: { timeout: 300 }, title: 'Settings', arrow: true },
                            react_1["default"].createElement(icons_1.Settings, { onClick: function () { return chrome.tabs.create({ url: '/settings.html' }); } }))))),
            react_1["default"].createElement(react_bootstrap_1.ProgressBar, { className: 'control__usage__progress-bar', now: pauseUsagePercent, label: pauseUsagePercent + " %" }))));
};
exports["default"] = Header;
