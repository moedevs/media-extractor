import {
  IMediaClient,
  MediaClientOptions,
  MediaClientSettings, ResolveResponse,
  ResolveTypes
} from "media-extractor";
import axios, { AxiosInstance } from "axios";
import { createWindow } from "domino";
// @ts-ignore
import { getMetadata } from "page-metadata-parser";
import { extension } from "mime-types";

class MediaClient<T extends ResolveTypes = "url"> implements IMediaClient<T> {
  public readonly opts: MediaClientSettings<T>;
  private readonly axios: AxiosInstance;
  private static defaultOpts: MediaClientSettings<"url"> = {
    downloadNonUrl: false,
    returnAs: "url",
    validateImages: false,
    accept: [],
    hash: false
  };

  constructor(opts: MediaClientOptions<T> = {}) {
    this.opts = { ...MediaClient.defaultOpts, ...opts } as MediaClientSettings<T>;
    this.axios = this.generateAxios(this.opts.returnAs);
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
    const mtd = getMetadata(document, url);
    return mtd;
  };

  private async resolveImage(url: string, type: T) {
    const data = await axios.head(url);
    const mimeType = extension(data.headers['content-type']);
    console.log(data.headers);
  };

  public async resolve(url: string): Promise<ResolveResponse<T> | undefined> {
    const mtd = await this.metadata(url);

    if (!mtd.image) {
      return;
    }

    const data = await axios.head(url);
    const contentType = data.headers['content-type'];
    const mimeType = extension(contentType);

    return {
      image: Buffer.from(""),
      type: this.opts.returnAs
    };
  }
}
