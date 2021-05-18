function onPlaylistBeforeRequest(details) {

  // (hls\/|vod\/)(.+?)$
  const match = /(hls|vod)\/(.+?)$/gim.exec(details.url);


  if (match !== null && match.length > 1) {
    /* Break down the matches */
    const firstMatch = match[1]
    let secondMatch = match[2]

    /* Look for the search term, user_id which passes private information */
    const searchTerm = "user_id"
    /* Rewrite the secondMatch with everything previous to the private information */
    secondMatch = secondMatch.substring(0, secondMatch.indexOf(searchTerm))

    var playlistType = firstMatch == "vod" ? "vod" : "playlist";

    return new Promise(resolve => {
      fetch(
        'https://api.ttv.lol/ping',
        {
          method: 'GET',
        }).then(r => {
          if (r.status == 200) {
            resolve({ redirectUrl: `https://api.ttv.lol/${playlistType}/${encodeURIComponent(secondMatch)}` });
          } else {
            resolve({});
          }
        }).catch((error) => {
          resolve({});
        });
    });

  }
}

browser.webRequest.onBeforeRequest.addListener(
  onPlaylistBeforeRequest,
  { urls: ["https://usher.ttvnw.net/api/channel/hls/*", "https://usher.ttvnw.net/vod/*"] },
  ["blocking"]
);

function onBeforeSendHeaders(req) {
  req.requestHeaders.push({ name: 'X-Donate-To', value: "https://ttv.lol/donate" })
  return {
    requestHeaders: req.requestHeaders
  }
}

browser.webRequest.onBeforeSendHeaders.addListener(
  onBeforeSendHeaders,
  { urls: ["https://api.ttv.lol/playlist/*", "https://api.ttv.lol/vod/*"] },
  ["blocking", "requestHeaders"]
);