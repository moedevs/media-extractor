declare module "media-extractor" {
  import { Stream } from "stream"

  enum ImageTypes {
    GIF,
    PNG,
    JPG,
    WEBM
  }

  /**
   * @private Mapping of input strings to output types
   */
  interface ResolveMap {
    readonly url: string,
    readonly stream: Stream,
    readonly buffer: Buffer
  }

  type ResolveTypes = keyof ResolveMap;

  type MediaTypes
    = "gif"
    | "png"
    | "jpeg"

  interface MediaClientSettings<T extends ResolveTypes = "url"> {
    /**
     * Download images returned in non-url forms?
     * This only works when `validateImages` is enabled and `returnAs` isn't "url"
     *
     * @default false
     */
    readonly downloadNonUrl: boolean;
    /**
     * Return types of images
     *
     * @link {@ResolveType}
     * @default "url"
     */
    readonly returnAs: T;
    /**
     * Sends a HEAD request to possible links to discover their
     * types (whether they're a valid gif or not) before returning
     * the result
     *
     * @default false
     */
    readonly validateImages: boolean;
    /**
     * Allows the user to insert their own url validation
     */
    readonly filter?: (url: string) => Promise<boolean> | boolean;
    /**
     * Accepted media types as response
     *
     * @default All
     */
    readonly accept: ImageTypes[];
    /**
     * Whether or not to return the hash of the images / gifs
     *
     * @default false
     */
    readonly hash: boolean;
  }

  type MediaClientOptions<T extends ResolveTypes> = Partial<MediaClientSettings<T>>;

  interface ResolveResponse<T extends ResolveTypes> {
    /**
     * Image response can be a url, buffer or stream
     */
    image: ResolveMap[T];
    /**
     * Hash of the image or the first frame of the gif, if enabled
     */
    hash?: string;
    /**
     * Type of the response
     */
    type: MediaTypes
  }

  interface IMediaClient<T extends ResolveTypes = "url"> {
    /**
     * Resolve an image url
     */
    resolve(url: string): Promise<ResolveResponse<T> | undefined>;
  }
}
