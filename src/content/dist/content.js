"use strict";
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
/* eslint-disable  */
var getYTVideos_1 = require("../common/getYTVideos");
var jquery_1 = require("jquery");
// declare var jQuery
var bodyHidden;
var keywordSearch = [];
var goodVideos = [];
var badVideos = [];
// Adapted slightly from Sam Dutton
// Set name of hidden property and visibility change event
// since some browsers only offer vendor-prefixed support
// let hidden;
// let state;
var visibilityChange;
if (typeof document.hidden !== 'undefined') {
    // hidden = 'hidden';
    visibilityChange = 'visibilitychange';
    // state = 'visibilityState';
}
// Add a listener that constantly changes the title
document.addEventListener(visibilityChange, function () {
    // document.title = document[state]
    chrome.runtime.sendMessage({ hidden: document.hidden });
}, false);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(sender, ' sent >>>> ', request);
    if (request.newVisit) {
        sendResponse({ msg: 'got it' });
        return;
    }
    if (request.hidden) {
        sleep(10).then(function () {
            sendResponse({
                hidden: document.hidden,
                focus: document.hasFocus(),
                href: location.href
            });
            // console.log('sending res ', {
            //     hidden: document.hidden,
            //     focus: document.hasFocus(),
            //     href: location.href,
            // });
        });
    }
    else {
        sendResponse({ msg: 'got it' });
        return;
    }
    console.log('return true ');
    return true;
});
jquery_1["default"](window).focus(function () {
    // do something
    chrome.runtime.sendMessage({ focus: true }, function (response) { });
});
jquery_1["default"](window).blur(function () {
    // do something
    chrome.runtime.sendMessage({ focus: false }, function (response) { });
});
jquery_1["default"](document).ready(function () {
    // console.log('document loaded ');
    if (window.location.href.includes('youtube.com')) {
        jquery_1["default"]('body').css('display', 'none');
        bodyHidden = true;
    }
    document.body.addEventListener('click', function () {
        // console.log('click ');
        chrome.runtime.sendMessage({ message: 'click' }, function (response) { });
    });
    document.body.addEventListener('keypress', function () {
        // console.log('key press ');
        chrome.runtime.sendMessage({ message: 'keypress' }, function (response) { });
    });
});
// // select the target node
// var target = document.querySelector('title')
// // create an observer instance
// var observer = new MutationObserver(function (mutations) {
//   // We need only first event and only new value of the title
//   console.log('title changed', mutations)
//   chrome.runtime.sendMessage({title: mutations[0].target.text}, function (response) {
//     console.log(response)
//   })
// })
// configuration of the observer:
// var config = { subtree: true, characterData: true, childList: true}
// // pass in the target node, as well as the observer options
// observer.observe(target, config)
function checkYoutube() {
    return __awaiter(this, void 0, void 0, function () {
        var videos, chunkArr, i, j, ids, ytVideos, _loop_1, _i, chunkArr_1, v;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jquery_1["default"]('ytd-miniplayer')) {
                        jquery_1["default"]('ytd-miniplayer').remove();
                    }
                    if (!window.location.href.includes('youtube.com')) return [3 /*break*/, 4];
                    if (bodyHidden) {
                        jquery_1["default"]('body').css('display', 'block');
                        bodyHidden = false;
                    }
                    videos = jquery_1["default"]('ytd-compact-autoplay-renderer,ytd-rich-item-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,ytd-video-renderer,#movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles > div > a').toArray();
                    console.log('videos', videos);
                    chunkArr = void 0;
                    i = 0, j = videos.length;
                    _a.label = 1;
                case 1:
                    if (!(i < j)) return [3 /*break*/, 4];
                    chunkArr = videos.slice(i, i + 50);
                    chunkArr = chunkArr.filter(function (v) {
                        var el = jquery_1["default"](v);
                        var id = getId(el);
                        if (!id) {
                            // console.log('video with no id ', id, el);
                            return;
                        }
                        if (el.attr('tr-allowed')) {
                            return false;
                        }
                        if (el.attr('tr-video-id') === id) {
                            return false;
                        }
                        el.attr('tr-video-id', id);
                        coverVideo(el);
                        return true;
                    });
                    ids = chunkArr
                        .map(function (v) {
                        var el = jquery_1["default"](v);
                        var id = getId(el);
                        el.videoId = id;
                        return id;
                    })
                        .filter(function (id) { return id; });
                    if (!ids.length) {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, getYTVideos_1["default"](ids.join(','))];
                case 2:
                    ytVideos = _a.sent();
                    _loop_1 = function (v) {
                        try {
                            // const v = chunkArr[k];
                            var el_1 = jquery_1["default"](v);
                            var id_1 = getId(el_1);
                            if (!id_1) {
                                return "continue";
                            }
                            var ytVideo = ytVideos.items.find(function (v) { return v.id === id_1; });
                            chrome.runtime.sendMessage({ msg: 'checkVideo', snippet: ytVideo.snippet }, function (response) {
                                // console.log('got response ------------------', response)
                                if (response.allowVid) {
                                    allowVid(el_1);
                                }
                                else {
                                    badVideos.push(el_1);
                                    el_1.find('a').toArray().forEach(function (a) { return jquery_1["default"](a).attr('href', 'javascript:void(0)'); });
                                    el_1.find('img').toArray().forEach(function (a) { return jquery_1["default"](a).attr('src', ''); });
                                    el_1.hover(function () {
                                        setTimeout(function () {
                                            el_1.find('img').toArray().forEach(function (a) { return jquery_1["default"](a).attr('src', ''); });
                                            el_1.find('video').toArray().forEach(function (a) { return jquery_1["default"](a).attr('src', ''); });
                                        }, 2);
                                    });
                                    el_1.find('yt-formatted-string').toArray().forEach(function (a) { return jquery_1["default"](a).html(''); });
                                }
                                // if (k === chunkArr.length - 1) {
                                //   replaceBadVideos();
                                // }
                            });
                        }
                        catch (error) {
                            console.error('errrrrrrrrrrrrrrrrrrrrr checking ', error);
                        }
                    };
                    // console.log('got videos ', ytVideos);
                    for (_i = 0, chunkArr_1 = chunkArr; _i < chunkArr_1.length; _i++) {
                        v = chunkArr_1[_i];
                        _loop_1(v);
                    }
                    _a.label = 3;
                case 3:
                    i += 50;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function replaceBadVideos() {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // console.log('replace bad vids', badVideos);
                return [4 /*yield*/, getGoodVideos()];
                case 1:
                    // console.log('replace bad vids', badVideos);
                    _a.sent();
                    _loop_2 = function () {
                        var goodVid, el;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    goodVid = goodVideos.shift();
                                    if (!!goodVid) return [3 /*break*/, 2];
                                    return [4 /*yield*/, getGoodVideos()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    el = badVideos.shift();
                                    chrome.runtime.sendMessage({ msg: 'checkVideo', snippet: goodVid.snippet }, function (response) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!response.allowVid) return [3 /*break*/, 1];
                                                        if (el) {
                                                            // console.log('replace vid ', el, goodVid);
                                                            el.click(function () {
                                                                location.href = "https://www.youtube.com/watch?v=" + goodVid.id.videoId;
                                                            });
                                                            el.attr('tr-allowed', 'true');
                                                            allowVid(el);
                                                            if (el.prop('tagName') !== 'A') {
                                                                el.css('position', 'relative');
                                                            }
                                                            el.append("<a href=" + ("https://www.youtube.com/watch?v=" + goodVid.id.videoId) + " style=\"\n            width: 100%;\n            height: 100%;\n            position: absolute;\n            z-index: 100;\n            display: block;\n            top: 0; \"></a>");
                                                            el.find('a')
                                                                .toArray()
                                                                .forEach(function (a) {
                                                                var link = jquery_1["default"](a);
                                                                if (link.attr('href')) {
                                                                    link.removeAttr('src').attr('href', link
                                                                        .attr('href')
                                                                        .replace(/watch\?v=(.{11})/, "watch?v=" + goodVid.id.videoId)
                                                                        .replace(/channel\/(.{24})/, "channel/" + goodVid.snippet.channelId));
                                                                }
                                                            });
                                                            el.find('yt-img-shadow')
                                                                .toArray()
                                                                .forEach(function (img) {
                                                                jquery_1["default"](img).html("<img id=\"tr-img\" class=\"style-scope yt-img-shadow\" alt=\"\" width=\"9999\" src=" + goodVid.snippet.thumbnails.high.url + ">");
                                                            });
                                                            el.find('#video-title').text(goodVid.snippet.title);
                                                            el.find('#text.ytd-channel-name ').text(goodVid.snippet.channelTitle);
                                                            el.find('#metadata-line').text(goodVid.snippet.channelTitle);
                                                            el.find('#mouseover-overlay').remove();
                                                            el.find('#hover-overlays').remove();
                                                        }
                                                        return [3 /*break*/, 3];
                                                    case 1: return [4 /*yield*/, getGoodVideos()];
                                                    case 2:
                                                        _a.sent();
                                                        badVideos.push(el);
                                                        _a.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!badVideos.length) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getId(el) {
    var url;
    if (el.prop('tagName') === 'A') {
        url = el.attr('href');
    }
    else {
        url = el.find('#thumbnail') && el.find('#thumbnail').attr('href');
    }
    var match = url && url.match(/watch\?v=(.{11})/);
    return match && match[1];
}
function coverVideo(el) {
    if (el.find('.tracker-video-cover')[0])
        return;
    if (el.prop('tagName') !== 'A') {
        el.css('position', 'relative');
    }
    // el.find('a').toArray().forEach(a=>jQuery(a).attr('href','javascript:void(0)'));
    // el.find('img').toArray().forEach(a=>jQuery(a).attr('src',''));
    // el.find('yt-formatted-string').toArray().forEach(a=>jQuery(a).html(''));
    el.append("<div class=\"tracker-video-cover\" style=\"\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  background-color: var(--yt-spec-general-background-a);\n  z-index: 1000;\n  top: 0; \"></div>");
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkYoutube()];
            case 1:
                _a.sent();
                return [4 /*yield*/, sleep(1000)];
            case 2:
                _a.sent();
                return [4 /*yield*/, checkYoutube()];
            case 3:
                _a.sent();
                setInterval(function () {
                    checkYoutube();
                }, 2000);
                return [2 /*return*/];
        }
    });
}); })();
function allowVid(el) {
    if (!el)
        return;
    el.find('div.tracker-video-cover').remove();
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function getGoodVideos() {
    return __awaiter(this, void 0, void 0, function () {
        var keyword, videos, videosJSON;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(badVideos.length > goodVideos.length)) return [3 /*break*/, 3];
                    keyword = keywordSearch[Math.floor(Math.random() * keywordSearch.length)];
                    return [4 /*yield*/, fetch("http://localhost:36168/videos/search?q=" + keyword + "&count=" + (badVideos.length -
                            goodVideos.length))];
                case 1:
                    videos = _a.sent();
                    return [4 /*yield*/, videos.json()];
                case 2:
                    videosJSON = _a.sent();
                    console.log('got good vids ', videosJSON);
                    goodVideos = goodVideos.concat(videosJSON);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
