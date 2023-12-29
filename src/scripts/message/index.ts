import { BlobInfo, SuccessTransformedData } from "../../types/index";
import { BlobHandler } from "../blob/index";
import { DocumentWriter } from "../dom/index";
import { RenderObserver } from "../observer/index";

export class MessageHandler {
  private renderObserver: RenderObserver;

  private blobHandler: BlobHandler;

  private blobs: BlobInfo[] = [];

  private cleanups: (() => void)[] = [];

  constructor(private event: MessageEvent) {
    this.renderObserver = new RenderObserver();
    this.blobHandler = new BlobHandler();
  }

  private parseData() {
    const { files, componentName } = JSON.parse(
      this.event.data
    ) as SuccessTransformedData;

    const blobs = this.blobHandler.createObjectURs(files);

    this.blobs = blobs;
    const mainBlobURL = blobs[0].url;

    return {
      blobs,
      componentName,
      mainBlobURL,
    };
  }

  async onMessage() {
    if (this.event.origin !== "http://localhost:3000") return;

    const { componentName, mainBlobURL } = this.parseData();

    this.writeDocument(componentName, mainBlobURL, this.blobs);

    await this.postParentMessage();
    this.blobHandler.revokeObjectURLs(this.blobs.map((blob) => blob.url));
    this.cleanups.forEach((cleanup) => cleanup());
  }

  private async postParentMessage() {
    if (!this.event.source) throw new Error("No event source");

    const height = await this.renderObserver.stopCompleteRendered();

    const message = JSON.stringify({
      height,
      message: "rendered",
    });

    this.event.source.postMessage(message, {
      targetOrigin: this.event.origin,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private writeDocument(
    componentName: string | null,
    mainBlobURL: string,
    blobURLs: BlobInfo[]
  ) {
    const writer = new DocumentWriter(mainBlobURL, componentName, blobURLs);

    const cleanups = writer.writeDocument();

    cleanups.forEach((cleanup) => this.cleanups.push(cleanup));
  }
}
