import { MediaClient, MediaClientOptions, ResolveMap } from "media-extractor";
import { resolve } from ".";

export const createClient = <T extends keyof ResolveMap = "url">(opts?: MediaClientOptions<T>): MediaClient<T> => {
  return {
    resolve
  }
};


const e = createClient({ returnAs: "buffer" });
e.resolve
