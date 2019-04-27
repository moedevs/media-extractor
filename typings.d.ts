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
    /**
     * Resolves into a URL (if available)
     */
    readonly url: string,
    /**
     * Downloads relevant images and resolves into a stream
     */
    readonly stream: Stream,
    /**
     * Downloads relevant images and resolves into a buffer
     */
    readonly buffer: Buffer
    // /**
    //  * Resolves into URL if avaiable, if not,
    //  * downloads them and returns a stream
    //  */
    // readonly urlOrStream: string | Stream;
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
     * Note: not every image might be available in url form
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

  /**
   * Options for the MediaClient constructor
   */
  type MediaClientOptions<T extends ResolveTypes> = Partial<MediaClientSettings<T>>;

  interface ResolveResponse<T extends ResolveTypes> {
    /**
     * Url the media was fetched from
     */
    url: string;
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
    format: MediaTypes

    type: T;
  }

  interface IMediaClient<T extends ResolveTypes = "url"> {
    /**
     * Resolve an image url
     */
    resolve(url: string): Promise<ResolveResponse<T> | undefined>;
  }
}
