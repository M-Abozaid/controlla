"use strict";
exports.__esModule = true;
var React = require("react");
var ReactDOM = require("react-dom");
var addRule_1 = require("./addRule");
chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    ReactDOM.render(React.createElement(addRule_1["default"], { onRuleAdded: function () { return null; } }), document.getElementById('AddRule'));
});
