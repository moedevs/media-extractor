declare module "media-extractor" {
  import { Stream } from "stream"

  enum ImageTypes {
    GIF,
    PNG,
    JPG,
    WEBM
  }

  interface ResolveMap {
    readonly url: string,
    readonly stream: Stream,
    readonly buffer: Buffer
  }

  interface MediaClientOptions<T extends keyof ResolveMap = "url"> {
    /**
     * Return types of images 
     * 
     * @link {@ResolveType}
     * @default "url"
     */
    readonly returnAs?: T;
    /**
     * Sends a HEAD request to possible links to discover their
     * types (whether they're a valid gif or not) before returning
     * the result
     * 
     * @default false
     */
    readonly validateImages?: boolean;
    /**
     * Allows the user to insert their own url validation
     */
    readonly filter?: (url: string) => Promise<boolean> | boolean;
    /**
     * Accepted media types as response
     * 
     * @default All
     */
    readonly accept?: ImageTypes[] | undefined;
  }

  interface MediaClient<T extends keyof ResolveMap = "url"> {
    readonly resolve: (url: string) => Promise<ResolveMap[T]>;
  }
}
