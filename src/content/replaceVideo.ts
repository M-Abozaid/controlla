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
