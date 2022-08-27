import getYTVideos from '../common/getYTVideos'

import $ from 'jquery'
import { YTCategories } from '../types/index'

const keywordSearch = []
let goodVideos: gapi.client.youtube.Video[] = []
const badVideos = []
;(window as any).badVideos = badVideos

let visibilityChange
if (typeof document.hidden !== 'undefined') {
  // hidden = 'hidden';
  visibilityChange = 'visibilitychange'
  // state = 'visibilityState';
}

// Add a listener that constantly changes the title
document.addEventListener(
  visibilityChange,
  () => {
    // document.title = document[state]
    chrome.runtime.sendMessage({ hidden: document.hidden })
  },
  false
)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(sender, ' sent >>>> ', request);

  if (request.newVisit) {
    sendResponse({ msg: 'got it' })
    return
  }
  if (request.hidden) {
    sleep(10).then(() => {
      sendResponse({
        hidden: document.hidden,
        focus: document.hasFocus(),
        href: location.href,
      })
    })
  } else {
    sendResponse({ msg: 'got it' })
    return
  }
  //   console.log('return true ')
  return true
})

$(window).focus(function() {
  // do something
  chrome.runtime.sendMessage({ focus: true })
})

$(window).blur(function() {
  // do something
  chrome.runtime.sendMessage({ focus: false })
})

$(document).ready(() => {
  document.body.addEventListener('click', function() {
    // console.log('click ');
    chrome.runtime.sendMessage({ message: 'click' })
  })

  document.body.addEventListener('keypress', function() {
    // console.log('key press ');
    chrome.runtime.sendMessage({ message: 'keypress' })
  })
})

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
  // if ($('ytd-miniplayer')) {
  //   $('ytd-miniplayer').remove()
  // }
  if (window.location.href.includes('youtube.com')) {
    const videos = $(
      'ytd-compact-autoplay-renderer,ytd-rich-item-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,ytd-video-renderer,#movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles > div > a'
    ).toArray()

    // console.log('videos', videos)

    let chunkArr
    for (let i = 0, j = videos.length; i < j; i += 50) {
      chunkArr = videos.slice(i, i + 50)
      chunkArr = chunkArr.filter(v => {
        const el = $(v)
        const id = getId(el)

        if (!id) {
          // console.log('video with no id ', id, el);
          return
        }
        if (el.attr('tr-allowed')) {
          return false
        }
        if (el.attr('tr-video-id') === id) {
          return false
        }
        if (el.attr('tr-video-id')) {
          el.off('mouseenter mouseleave')
        }
        el.attr('tr-video-id', id)
        coverVideo(el)
        return true
      })

      const ids = chunkArr
        .map(v => {
          const el = $(v)
          const id = getId(el)
          el.videoId = id
          return id
        })
        .filter(id => id)

      if (!ids.length) {
        continue
      }

      const ytVideos = await getYTVideos(ids.join(','))

      for (const v of chunkArr) {
        try {
          // const v = chunkArr[k];
          const el = $(v)
          const id = el.attr('tr-video-id')

          if (!id) {
            // console.log('no id ', el, v);
            continue
          }
          const ytVideo = ytVideos.items.find(vid => vid.id === id)

          chrome.runtime.sendMessage(
            { msg: 'checkVideo', snippet: ytVideo.snippet },
            function(response) {
              if (response.allowVid) {
                allowVid(el)
              } else {
                badVideos.push(el)

                el.find('a')
                  .toArray()
                  .forEach(a => $(a).attr('href', 'javascript:void(0)'))
                el.find('img')
                  .toArray()
                  .forEach(a => $(a).attr('src', ''))
                // el.find('yt-formatted-string')
                //   .toArray()
                //   .forEach(a => $(a).text('..'))
                el.hover(() => {
                  setTimeout(() => {
                    el.find('img')
                      .toArray()
                      .forEach(a => $(a).attr('src', ''))
                    el.find('video')
                      .toArray()
                      .forEach(a => $(a).attr('src', ''))
                  }, 2)
                })
              }

              // if (k === chunkArr.length - 1) {
              //   replaceBadVideos();
              // }
            }
          )
        } catch (error) {
          console.error('error checking youtube video', error)
        }
      }
    }
  }

  if (window.location.href.includes('youtube.com/watch?')) {
    try {
      const match = /watch\?v=(.{11})/.exec(window.location.href)
      const videoId = match && match[1]

      if (videoId && !$.find(`#tracker-video-info-${videoId}`)[0]) {
        const [videoDetails] = (await getYTVideos([videoId])).items
        addVideoInfo(videoDetails)
      }
    } catch (error) {
      console.log('error adding video details ', error)
    }
  }
}

/**
 *


 async function replaceBadVideos() {
   // console.log('replace bad vids', badVideos);
   await getGoodVideos()

   while (badVideos.length) {
     const goodVid = goodVideos.shift()
     if (!goodVid) await getGoodVideos()
     const el = badVideos.shift()

     chrome.runtime.sendMessage(
       { msg: 'checkVideo', snippet: goodVid.snippet },
       async function(response) {
         if (response.allowVid) {
           if (el) {
             // console.log('replace vid ', el, goodVid);
             el.click(() => {
               location.href = `https://www.youtube.com/watch?v=${goodVid.id}`
             })
             el.attr('tr-allowed', 'true')
             allowVid(el)
             if (el.prop('tagName') !== 'A') {
               el.css('position', 'relative')
             }

             el.append(`<a href=${`https://www.youtube.com/watch?v=${goodVid.id}`} style="
             width: 100%;
             height: 100%;
             position: absolute;
             z-index: 100;
             display: block;
             top: 0; "></a>`)

             el.find('a')
               .toArray()
               .forEach(a => {
                 const link = $(a)
                 if (link.attr('href')) {
                   link.removeAttr('src').attr(
                     'href',
                     link
                       .attr('href')
                       .replace(/watch\?v=(.{11})/, `watch?v=${goodVid.id}`)
                       .replace(
                         /channel\/(.{24})/,
                         `channel/${goodVid.snippet.channelId}`
                       )
                   )
                 }
               })

             el.find('yt-img-shadow')
               .toArray()
               .forEach(img => {
                 $(img).html(
                   `<img id="tr-img" class="style-scope yt-img-shadow" alt="" width="9999" src=${goodVid.snippet.thumbnails.high.url}>`
                 )
               })
             el.find('#video-title').text(goodVid.snippet.title)
             el.find('#text.ytd-channel-name ').text(
               goodVid.snippet.channelTitle
             )
             el.find('#metadata-line').text(goodVid.snippet.channelTitle)

             el.find('#mouseover-overlay').remove()
             el.find('#hover-overlays').remove()
           }
         } else {
           await getGoodVideos()
           badVideos.push(el)
         }
       }
     )
   }

   // el.append(`<div class="tracker-video-cover"></div>`)
 }

 */

function getId(el) {
  let url

  if (el.prop('tagName') === 'A') {
    url = el.attr('href')
  } else {
    url = el.find('#thumbnail') && el.find('#thumbnail').attr('href')
  }

  if (!url) return ''
  const match = url && url.match(/watch\?v=(.{11})/)
  if (!match || !match[1]) return ''
  return match && match[1]
}

function coverVideo(el) {
  if (el.find('.tracker-video-cover')[0]) return
  if (el.prop('tagName') !== 'A') {
    el.css('position', 'relative')
  }

  el.append(`<div class="tracker-video-cover" style="
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--yt-spec-general-background-a);
  z-index: 1000;
  top: 0; "></div>`)
}

function addVideoInfo(details: gapi.client.youtube.Video) {
  //   console.log('add video info ', YTCategories, details.snippet)
  if ($.find(`#tracker-video-info-${details.id}`)[0]) return
  $('.tk-video-info').remove()
  $('#description-inline-expander > yt-formatted-string').append(`
    <table id="tracker-video-info-${details.id}" class="tk-video-info">
    <tr>
      <th>Category</th>
      <th>Tags</th>
      <th>Published At</th>
    </tr>
    <tr>
      <td>${
        Object.keys(YTCategories).filter(
          key => YTCategories[key].toString() === details.snippet.categoryId
        )[0]
      }</td>
      <td style="max-width:250px;">${details.snippet.tags?.join(', ')}</td>
      <td>${details.snippet.publishedAt}</td>
    </tr>

  </table>
    `)
  // .insertAfter(
  // $('.content.style-scope.ytd-video-secondary-info-renderer')[0])
}
;(async () => {
  await checkYoutube()
  setInterval(() => {
    checkYoutube()
  }, 2000)
})()

function allowVid(el) {
  if (!el) return
  el.find('div.tracker-video-cover').remove()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getGoodVideos() {
  // get videos
  if (badVideos.length > goodVideos.length) {
    const keyword =
      keywordSearch[Math.floor(Math.random() * keywordSearch.length)]
    const videos = await fetch(
      `http://localhost:36168/videos/search?q=${keyword as string}&count=${badVideos.length -
        goodVideos.length}`
    )
    const videosJSON = await videos.json()

    console.log('got good vids ', videosJSON)
    goodVideos = goodVideos.concat(videosJSON)
  }
}
