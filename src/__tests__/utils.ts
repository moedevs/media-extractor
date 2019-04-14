/**
 * Discarding query parameters
 * @param url
 */
export const replaceQuery = (url: string) => url.replace(/\?.+/, '');

/**
 * Matching urls to be equal
 * @param url
 */
export const match = (url: string) => (out: string) =>
  expect(url).toEqual(out);

/**
 * Matching urls while discarding the query parameters
 * @param url
 */
export const looseMatch = (url: string) => (out: string) =>
  expect(replaceQuery(url)).toEqual(replaceQuery(out));

