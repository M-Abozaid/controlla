"use strict";
exports.__esModule = true;
exports.YTCategories = exports.MatcherType = void 0;
var MatcherType;
(function (MatcherType) {
    MatcherType["URL"] = "URL";
    MatcherType["YT_TITLE"] = "YT_TITLE";
    MatcherType["YT_CHANNEL"] = "YT_CHANNEL";
    MatcherType["YT_CATEGORY"] = "YT_CATEGORY";
    MatcherType["YT_TAGS"] = "YT_TAGS";
})(MatcherType = exports.MatcherType || (exports.MatcherType = {}));
var YTCategories;
(function (YTCategories) {
    YTCategories["Film & Animation"] = "1";
    YTCategories["Autos & Vehicles"] = "2";
    YTCategories["Music"] = "10";
    YTCategories["Pets & Animals"] = "15";
    YTCategories["Sports"] = "17";
    YTCategories["Short Movies"] = "18";
    YTCategories["Travel & Events"] = "19";
    YTCategories["Gaming"] = "20";
    YTCategories["Videoblogging"] = "21";
    YTCategories["People & Blogs"] = "22";
    YTCategories["Comedy"] = "23";
    YTCategories["Entertainment"] = "24";
    YTCategories["News & Politics"] = "25";
    YTCategories["Howto & Style"] = "26";
    YTCategories["Education"] = "27";
    YTCategories["Science & Technology"] = "28";
    YTCategories["Nonprofits & Activism"] = "29";
    YTCategories["Movies"] = "30";
    YTCategories["Anime/Animation"] = "31";
    YTCategories["Action/Adventure"] = "32";
    YTCategories["Classics"] = "33";
    YTCategories["Documentary"] = "35";
    YTCategories["Drama"] = "36";
    YTCategories["Family"] = "37";
    YTCategories["Foreign"] = "38";
    YTCategories["Horror"] = "39";
    YTCategories["Sci-Fi/Fantasy"] = "40";
    YTCategories["Thriller"] = "41";
    YTCategories["Shorts"] = "42";
    YTCategories["Shows"] = "43";
    YTCategories["Trailers"] = "44";
})(YTCategories = exports.YTCategories || (exports.YTCategories = {}));
// // loop on categories
// for (const key in YTCategories) {
//     // console.log('cateogory title ', key)
//     // console.log('cateogry id ', YTCategories[key])
//     // use category id for matcher.value
// }
