"use strict";
exports.__esModule = true;
var types_1 = require("../types");
var RuleMatcher = /** @class */ (function () {
    function RuleMatcher() {
    }
    RuleMatcher.prototype.matchVideoTitle = function (matcher, title) {
        if (matcher.type !== types_1.MatcherType.YT_TITLE)
            return false;
        if (matcher.value instanceof RegExp) {
            return matcher.value.test(title);
        }
        return title.toLowerCase().includes(matcher.value.toLowerCase());
    };
    RuleMatcher.prototype.matchVideoCategory = function (matcher, categoryId) {
        if (matcher.type !== types_1.MatcherType.YT_CATEGORY)
            return false;
        return matcher.value.includes(categoryId);
    };
    RuleMatcher.prototype.matchChannel = function (matcher, channel) {
        if (matcher.type !== types_1.MatcherType.YT_CHANNEL)
            return false;
        if (matcher.value instanceof RegExp) {
            return matcher.value.test(channel);
        }
        return channel.toLowerCase().trim() === matcher.value.toLowerCase().trim();
    };
    RuleMatcher.prototype.matchYtTAGS = function (matcher, tags) {
        if (matcher.type !== types_1.MatcherType.YT_TAGS)
            return false;
        if (!tags)
            return false;
        return tags.some(function (tag) { return matcher.value.includes(tag); });
    };
    RuleMatcher.prototype.matchURL = function (matcher, _a) {
        var url = _a.url;
        if (matcher.type !== types_1.MatcherType.URL)
            return false;
        if (matcher.value instanceof RegExp) {
            return matcher.value.test(url);
        }
        return url.includes(matcher.value);
    };
    RuleMatcher.prototype.matchVideoSnippet = function (matcher, _a) {
        var categoryId = _a.categoryId, channelTitle = _a.channelTitle, title = _a.title, tags = _a.tags;
        return (this.matchVideoTitle(matcher, title) ||
            this.matchChannel(matcher, channelTitle) ||
            this.matchVideoCategory(matcher, categoryId) ||
            this.matchYtTAGS(matcher, tags));
    };
    RuleMatcher.prototype.matchTab = function (matcher, tab, snippet) {
        switch (matcher.type) {
            case types_1.MatcherType.URL:
                return this.matchURL(matcher, tab);
            case types_1.MatcherType.YT_CATEGORY:
            case types_1.MatcherType.YT_TITLE:
            case types_1.MatcherType.YT_CHANNEL:
            case types_1.MatcherType.YT_TAGS:
                return this.matchVideoSnippet(matcher, snippet);
            default:
                break;
        }
    };
    return RuleMatcher;
}());
var ruleMatcher = new RuleMatcher();
window.ruleMatcher = ruleMatcher;
exports["default"] = ruleMatcher;
