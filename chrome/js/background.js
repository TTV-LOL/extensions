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

    var req = new XMLHttpRequest();
    req.open("GET", `https://api.ttv.lol/ping`, false);
    req.send();

    // validate that our API is online, if not fallback to standard stream with ads
    if (req.status != 200) {
      return {
        redirectUrl: details.url
      };
    } else {
      return {
        redirectUrl: `https://api.ttv.lol/${playlistType}/${encodeURIComponent(secondMatch)}`,
      };
    }

  }
}

chrome.webRequest.onBeforeRequest.addListener(
  onPlaylistBeforeRequest,
  { urls: ["https://usher.ttvnw.net/api/channel/hls/*", "https://usher.ttvnw.net/vod/*"] },
  ["blocking", "extraHeaders"]
);

function onBeforeSendHeaders(req) {
  req.requestHeaders.push({ name: 'X-Donate-To', value: "https://ttv.lol/donate" })
  return {
    requestHeaders: req.requestHeaders
  }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  onBeforeSendHeaders,
  { urls: ["https://api.ttv.lol/playlist/*", "https://api.ttv.lol/vod/*"] },
  ["blocking", "requestHeaders"]
);