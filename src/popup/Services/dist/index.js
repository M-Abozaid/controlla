"use strict";
exports.__esModule = true;
exports.escapeRegExp = exports.extractHostname = exports.mapDayNumber = exports.getRuleTitle = exports.getActiveTab = void 0;
var index_1 = require("./../../types/index");
var chrome_promise_1 = require("chrome-promise");
function getActiveTab() {
    return chrome_promise_1["default"].tabs
        .query({
        currentWindow: true,
        active: true
    });
}
exports.getActiveTab = getActiveTab;
/*
@input: rule title as a regex
@output: the title of the rule as a string
*/
exports.getRuleTitle = function (matcher) {
    if (matcher.type === index_1.MatcherType.YT_CATEGORY) {
        return index_1.YTCategories[matcher.value];
    }
    return ("" + matcher.value).match(/[^\\\/\^\$]/gi);
};
/*
@input: a number repres. a day
@output: a one letter str reprs. the same day
*/
exports.mapDayNumber = function (index) {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][index];
};
// get host name url
function extractHostname(url) {
    var hostname;
    // find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    // find & remove port number
    hostname = hostname.split(':')[0];
    // find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}
exports.extractHostname = extractHostname;
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;
