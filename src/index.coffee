needle = require "needle"
fs = require "fs"
{ JSDOM } = require "jsdom"

get = (url) -> needle("get", url, { follow_max: 5 })

mediaSelectors =  {
  tenorView: "div.Gif img"
}

genQuerySelector = (root) -> root.window.document.querySelector

testRegex = (regex) -> (url) -> regex.test(url)
testGifRegex = (regex) -> (url) -> testRegex(regex, url) && !url.endsWith(".gif")

fetchImgSrc = (querySelector) -> (root) ->
  out = root.window.document.querySelector querySelector
  return out.attributes.src.value

wrapMatchers = (arr) -> [testGifRegex(a), fetchImgSrc(b)] for [a, b] in arr

matchers = wrapMatchers([
  [
    /tenor\.com\/view/,
    mediaSelectors.tenorView
  ]
]).concat [
  [
    testRegex(/tenor.com\/.+\.gif/),
    fetchImgSrc(mediaSelectors.tenorView)
  ]
]

offlineMatchers = [
  [
    testGifRegex(/giphy\.com\/gifs/),
    (url) ->
      [init..., last] = url.split('-')
      lastBit = last.replace(/\/*/, '')
      return "https://media.giphy.com/media/#{lastBit}/giphy.gif"
  ]
]

combined = matchers.concat offlineMatchers

findMatchingUrl = (url, matcher = combined) -> matcher.find(([condition]) -> condition url)

###*
  * Assumes that the url matches
  * @param {string} url
  * @param {object} body
  * @returns {string}
###
extractGeneric = (url, body) ->
  root = new JSDOM(body)
  [_, exec] = matchers.find ([condition]) -> condition url
  return exec root
  
###*
  * Extracts the url if valid
  * @param {string} url
  * @returns {Promise<Either<String, String>>}
###
resolve = (url) ->
  isValid = findMatchingUrl(url)

  if !isValid?
    return url

  matchingOffline = findMatchingUrl(url, offlineMatchers)

  if matchingOffline?
    return matchingOffline[1](url)

  # requires an actual thingy here
  resp = await get(url)
  return extractGeneric(url, resp.body)

exports.resolve = resolve