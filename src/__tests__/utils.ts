/**
 * Discarding query parameters
 * @param url
 */
import { MediaClient } from "../client";

export const replaceQuery = (url: string) => url.replace(/\?.+/, '');

export const generateMatcher = (client: MediaClient) => (url: string, target: string) => () =>
  client.resolve(url).then(out => {
    if (!out) {
      throw Error(out);
    }
    return expect(replaceQuery(out!.image)).toEqual(replaceQuery(target));
  });

const client = new MediaClient();
export const match = generateMatcher(client);
