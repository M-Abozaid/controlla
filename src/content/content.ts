import * as jQuery from 'jquery'
import getYTVideos from '../common/getYTVideos';

declare var jQuery

const keywordSearch = []
let goodVideos = [];
const badVideos = [];
// Adapted slightly from Sam Dutton
// Set name of hidden property and visibility change event
// since some browsers only offer vendor-prefixed support
// let hidden;
// let state;
let visibilityChange;
if (typeof document.hidden !== 'undefined') {
    // hidden = 'hidden';
    visibilityChange = 'visibilitychange';
    // state = 'visibilityState';
}

// Add a listener that constantly changes the title
document.addEventListener(
    visibilityChange,
    () => {
        // document.title = document[state]
        chrome.runtime.sendMessage({ hidden: document.hidden });
    },
    false,
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender, ' sent >>>> ', request);

    if (request.newVisit) {
        sendResponse({ msg: 'got it' });
        return;
    }
    if (request.hidden) {
        sleep(10).then(() => {
            sendResponse({
                hidden: document.hidden,
                focus: document.hasFocus(),
                href: location.href,
            });
            console.log('sending res ', {
                hidden: document.hidden,
                focus: document.hasFocus(),
                href: location.href,
            });
        });
    } else {
        sendResponse({ msg: 'got it' });
        return;
    }
    console.log('return true ');
    return true;
});

jQuery(window).focus(function () {
    // do something
    chrome.runtime.sendMessage({ focus: true }, function (response) { });
});

jQuery(window).blur(function () {
    // do something
    chrome.runtime.sendMessage({ focus: false }, function (response) { });
});

jQuery(document).ready(() => {
    console.log('document loaded ');

    document.body.addEventListener('click', function () {
        console.log('click ');
        chrome.runtime.sendMessage({ message: 'click' }, function (response) { });
    });

    document.body.addEventListener('keypress', function () {
        console.log('key press ');
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
async function checkYoutube() {
    if (jQuery('ytd-miniplayer')) {
        jQuery('ytd-miniplayer').remove();
    }
    if (window.location.href.includes('youtube.com')) {
        const videos = jQuery(
            'ytd-compact-autoplay-renderer,ytd-rich-item-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,ytd-video-renderer,#movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles > div > a',
        ).toArray();

        let chunkArr;
        for (let i = 0, j = videos.length; i < j; i += 50) {
            chunkArr = videos.slice(i, i + 50);
            chunkArr = chunkArr.filter(v => {
                const el = jQuery(v);
                const id = getId(el);

                if (!id) {
                    console.log('video with no id ', id, el);
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

            const ids = chunkArr
                .map(v => {
                    const el = jQuery(v);
                    const id = getId(el);
                    el.videoId = id;
                    return id;
                })
                .filter(id => id);

            if (!ids.length) {
                continue;
            }

            const ytVideos = await getYTVideos(ids.join(','));

            console.log('got videos ', ytVideos);

            for (let k = 0; k < chunkArr.length; k++) {
                try {
                    const v = chunkArr[k];
                    const el = jQuery(v);
                    const id = getId(el);

                    if (!id) {
                        console.log('no id ', el, v);
                        continue;
                    }
                    const ytVideo = ytVideos.items.find(v => v.id === id);

                    chrome.runtime.sendMessage({ msg: 'checkVideo', snippet: ytVideo.snippet }, function (
                        response,
                    ) {
                        if (response.allowVid) {
                            allowVid(el);
                        } else {
                            badVideos.push(el);
                        }

                        // if (k === chunkArr.length - 1) {
                        //   replaceBadVideos();
                        // }
                    });
                } catch (error) {
                    console.error('errrrrrrrrrrrrrrrrrrrrr checking ', error);
                }
            }
        }
    }
}

async function replaceBadVideos() {
    console.log('replace bad vids', badVideos);
    await getGoodVideos();

    while (badVideos.length) {
        const goodVid = goodVideos.shift();
        if (!goodVid) await getGoodVideos();
        const el = badVideos.shift();

        chrome.runtime.sendMessage({ msg: 'checkVideo', snippet: goodVid.snippet }, async function (
            response,
        ) {
            if (response.allowVid) {
                if (el) {
                    console.log('replace vid ', el, goodVid);
                    el.click(() => {
                        location.href = `https://www.youtube.com/watch?v=${goodVid.id.videoId}`;
                    });
                    el.attr('tr-allowed', 'true');
                    allowVid(el);
                    if (el.prop('tagName') !== 'A') {
                        el.css('position', 'relative');
                    }

                    el.append(`<a href=${`https://www.youtube.com/watch?v=${goodVid.id.videoId}`} style="
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 100;
            display: block;
            top: 0; "></a>`);

                    el.find('a')
                        .toArray()
                        .forEach(a => {
                            const link = jQuery(a);
                            if (link.attr('href')) {
                                link.removeAttr('src').attr(
                                    'href',
                                    link
                                        .attr('href')
                                        .replace(/watch\?v=(.{11})/, `watch?v=${goodVid.id.videoId}`)
                                        .replace(/channel\/(.{24})/, `channel/${goodVid.snippet.channelId}`),
                                );
                            }
                        });

                    el.find('yt-img-shadow')
                        .toArray()
                        .forEach(img => {
                            jQuery(img).html(
                                `<img id="tr-img" class="style-scope yt-img-shadow" alt="" width="9999" src=${goodVid.snippet.thumbnails.high.url}>`,
                            );
                        });
                    el.find('#video-title').text(goodVid.snippet.title);
                    el.find('#text.ytd-channel-name ').text(goodVid.snippet.channelTitle);
                    el.find('#metadata-line').text(goodVid.snippet.channelTitle);

                    el.find('#mouseover-overlay').remove();
                    el.find('#hover-overlays').remove();
                }
            } else {
                await getGoodVideos();
                badVideos.push(el);
            }
        });
    }

    // el.append(`<div class="tracker-video-cover"></div>`)
}

function getId(el) {
    let url;

    if (el.prop('tagName') === 'A') {
        url = el.attr('href');
    } else {
        url = el.find('#thumbnail') && el.find('#thumbnail').attr('href');
    }

    const match = url && url.match(/watch\?v=(.{11})/);
    return match && match[1];
}

function coverVideo(el) {
    if (el.find('.tracker-video-cover')[0]) return;
    if (el.prop('tagName') !== 'A') {
        el.css('position', 'relative');
    }

    el.append(`<div class="tracker-video-cover" style="
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--yt-spec-general-background-a);
  z-index: 100;
  top: 0; "></div>`);
}

(async () => {
    await checkYoutube();
    await sleep(1000);
    await checkYoutube();

    setInterval(() => {
        checkYoutube();
    }, 2000);
})();

function allowVid(el) {
    if (!el) return;
    el.find('div.tracker-video-cover').remove();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getGoodVideos() {
    // get videos
    if (badVideos.length > goodVideos.length) {
        const keyword = keywordSearch[Math.floor(Math.random() * keywordSearch.length)];
        const videos = await fetch(
            `http://localhost:36168/videos/search?q=${keyword}&count=${badVideos.length -
            goodVideos.length}`,
        );
        const videosJSON = await videos.json();

        console.log('got good vids ', videosJSON);
        goodVideos = goodVideos.concat(videosJSON);
    }
}
