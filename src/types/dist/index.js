"use strict";
exports.__esModule = true;
exports.YTCategories = exports.MatcherType = void 0;
var MatcherType;
(function (MatcherType) {
    MatcherType["URL"] = "URL";
    MatcherType["YT_TITLE"] = "YT_TITLE";
    MatcherType["YT_CHANNEL"] = "YT_CHANNEL";
    MatcherType["YT_CATEGORY"] = "YT_CATEGORY";
})(MatcherType = exports.MatcherType || (exports.MatcherType = {}));
var YTCategories;
(function (YTCategories) {
    YTCategories[YTCategories["Film & Animation"] = 1] = "Film & Animation";
    YTCategories[YTCategories["Autos & Vehicles"] = 2] = "Autos & Vehicles";
    YTCategories[YTCategories["Music"] = 10] = "Music";
    YTCategories[YTCategories["Pets & Animals"] = 15] = "Pets & Animals";
    YTCategories[YTCategories["Sports"] = 17] = "Sports";
    YTCategories[YTCategories["Short Movies"] = 18] = "Short Movies";
    YTCategories[YTCategories["Travel & Events"] = 19] = "Travel & Events";
    YTCategories[YTCategories["Gaming"] = 20] = "Gaming";
    YTCategories[YTCategories["Videoblogging"] = 21] = "Videoblogging";
    YTCategories[YTCategories["People & Blogs"] = 22] = "People & Blogs";
    YTCategories[YTCategories["Comedy"] = 23] = "Comedy";
    YTCategories[YTCategories["Entertainment"] = 24] = "Entertainment";
    YTCategories[YTCategories["News & Politics"] = 25] = "News & Politics";
    YTCategories[YTCategories["Howto & Style"] = 26] = "Howto & Style";
    YTCategories[YTCategories["Education"] = 27] = "Education";
    YTCategories[YTCategories["Science & Technology"] = 28] = "Science & Technology";
    YTCategories[YTCategories["Nonprofits & Activism"] = 29] = "Nonprofits & Activism";
    YTCategories[YTCategories["Movies"] = 30] = "Movies";
    YTCategories[YTCategories["Anime/Animation"] = 31] = "Anime/Animation";
    YTCategories[YTCategories["Action/Adventure"] = 32] = "Action/Adventure";
    YTCategories[YTCategories["Classics"] = 33] = "Classics";
    YTCategories[YTCategories["Documentary"] = 35] = "Documentary";
    YTCategories[YTCategories["Drama"] = 36] = "Drama";
    YTCategories[YTCategories["Family"] = 37] = "Family";
    YTCategories[YTCategories["Foreign"] = 38] = "Foreign";
    YTCategories[YTCategories["Horror"] = 39] = "Horror";
    YTCategories[YTCategories["Sci-Fi/Fantasy"] = 40] = "Sci-Fi/Fantasy";
    YTCategories[YTCategories["Thriller"] = 41] = "Thriller";
    YTCategories[YTCategories["Shorts"] = 42] = "Shorts";
    YTCategories[YTCategories["Shows"] = 43] = "Shows";
    YTCategories[YTCategories["Trailers"] = 44] = "Trailers";
})(YTCategories = exports.YTCategories || (exports.YTCategories = {}));
// // loop on categories
// for (const key in YTCategories) {
//     // console.log('cateogory title ', key)
//     // console.log('cateogry id ', YTCategories[key])
//     // use category id for matcher.value
// }
