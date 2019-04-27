import axios, { AxiosInstance } from "axios";
import { createWindow } from "domino";
import {
  IMediaClient,
  MediaClientOptions,
  MediaClientSettings, MediaTypes,
  ResolveMap,
  ResolveResponse, ResolveTypes
} from "media-extractor";
import { extension } from "mime-types";
// @ts-ignore
import { getMetadata } from "page-metadata-parser";

export class MediaClient<T extends ResolveTypes = "url"> implements IMediaClient<T> {
  private static defaultOpts: MediaClientSettings<"url"> = {
    downloadNonUrl: false,
    returnAs: "url",
    validateImages: false,
    accept: [],
    hash: false
  };
  public readonly opts: MediaClientSettings<T>;
  private readonly axios: AxiosInstance;

  constructor(opts: MediaClientOptions<T> = {}) {
    this.opts = { ...MediaClient.defaultOpts, ...opts } as MediaClientSettings<T>;
    this.axios = this.generateAxios(this.opts.returnAs);
  }

  public async resolve(url: string): Promise<ResolveResponse<T> | undefined> {
    const mtd = await this.metadata(url);

    const format = extension(mtd._type) as MediaTypes;
    const isAlreadyImage = ["gif", "png", "jpeg", "jpg"].some((mme) => format === mme);

    if (isAlreadyImage) {
      return {
        ...await this.resolveImage(url, this.opts.returnAs),
        format,
        url
      };
    }

    if (!mtd.image) {
      return;
    }

    return await this.processRequest(mtd.image, this.opts.returnAs);
  }

  private generateAxios(opt: T) {
    return axios.create({
      responseType: ({
        url: "text",
        stream: "stream",
        buffer: "arraybuffer"
      })[opt]
    });
  }

  private async metadata(url: string) {
    const res = await axios.get(url);
    const { document } = createWindow(res.data);
    return {
      ...getMetadata(document, url),
      _type: res.headers["content-type"]
    };
  }

  private async resolveImage(url: string, type: T): Promise<{ image: ResolveMap[T], type: T }> {
    const get = (responseType: string) => this.axios.get(url, { responseType }).then(({ data }) => ({
      type,
      image: data
    }));

    if (type === "url") {
      return { type, image: url };
    } else if (type === "buffer") {
      return get("arraybufffer");
    } else if (type === "stream") {
      return get("stream");
    } else {
      throw Error(`${type} is not a valid response type`);
    }
  }

  private async processRequest(url: string, type: T): Promise<ResolveResponse<T> | undefined> {
    const data = await axios.head(url);
    const format = extension(data.headers["content-type"]) as MediaTypes | false;

    if (format === false) {
      return;
    }

    return {
      ...await this.resolveImage(url, type),
      format,
      url
    };
  }
}
