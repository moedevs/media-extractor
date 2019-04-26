import needle from "needle";
import { HTMLElement, parse, TextNode } from "node-html-parser";
import { createWindow } from "domino"
// @ts-ignore
import { getMetadata } from "page-metadata-parser";
import { MediaClientOptions, ReturnTypes } from "media-extractor";

type QuerySelector = string;
type ImageSrc = string;
type ParseResult = (TextNode & {
  valid: boolean;
}) | (HTMLElement & {
  valid: boolean;
});

const precedence = [

];

type Matcher = [(url: string) => boolean, (selector: ParseResult) => ImageSrc]
type SimplifiedMatcher = [RegExp, QuerySelector];

const get = (url: string) => needle("get", url, { follow_max: 5 });

const mediaSelectors: { readonly [k: string]: QuerySelector } = {
  tenorView: "div.Gif img"
};

const testRegex = (regex: RegExp) => (url: string) => regex.test(url);
const testGifRegex = (regex: RegExp) => (url: string) => testRegex(regex)(url) && !url.endsWith(".gif");

const fetchImgSrc = (selector: QuerySelector) => (root: HTMLElement) => {
  const out = root.querySelector(selector);
  if (!out) {
    return console.error(`Could not find the expected element with selector ${selector}`);
  }
  return out.attributes.src;
};

const wrapMatchers = (arr: SimplifiedMatcher[]) =>
  arr.map(([a, b]) => [testRegex(a), fetchImgSrc(b)]);

const matchers = wrapMatchers([
  [
    /tenor\.com\/view/,
    mediaSelectors.tenorView
  ],
  [
    /tenor.com\/.+\.gif/,
    mediaSelectors.tenorView
  ]
]) as Array<Matcher>;

const offlineMatchers = [
  [
    testGifRegex(/giphy\.com\/gifs/),
    (url: string) => {
      const last = url.split('-').pop();
      if (!last) {
        return url;
      }
      const lastBit = last.replace(/\/*/, '');
      return `https://media.giphy.com/media/${lastBit}/giphy.gif`;
    }
  ]
];

const combined = matchers.concat(offlineMatchers as [any, any]) as Array<[(url: string) => boolean, any]>;

const findMatchingUrl = (url: string, matcher = combined) =>
  matcher.find(([condition]) => condition(url));

const extractGeneric = (url: string, body: string) => {
  const root = parse(body);
  const [_, exec] = matchers.find(([condition]) => condition(url))!;
  return exec(root);
};

export const resolve = async (url: string) => {
  const isValid = findMatchingUrl(url);
  if (!isValid) {
    return url;
  }
  const matchingOffline = findMatchingUrl(url, offlineMatchers as [any, any]);
  if (matchingOffline) {
    const [, extract] = matchingOffline;
    return extract(url);
  }
  const resp = await get(url);
  return extractGeneric(url, resp.body);
};

export const metadata = async (url: string) => {
  const res = await get(url);
  const { document } = createWindow(res.body);
  const mtd = getMetadata(document, url);
  return mtd;
};
