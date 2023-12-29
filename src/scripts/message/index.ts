import { SuccessTransformedData } from "../../types/index";
import { BlobHandler } from "../blob/index";
import { DocumentWriter } from "../dom/index";
import { RenderObserver } from "../observer/index";

export class MessageHandler {
  private renderObserver: RenderObserver;

  private blobHandler: BlobHandler;

  private blobURLs: string[] = [];

  constructor(private event: MessageEvent) {
    this.renderObserver = new RenderObserver();
    this.blobHandler = new BlobHandler();
  }

  private parseData() {
    const { files, componentName } = JSON.parse(
      this.event.data
    ) as SuccessTransformedData;

    const blobURLs = this.blobHandler.createObjectURs(files);

    this.blobURLs = blobURLs;

    const mainBlobURL = blobURLs[0];

    return {
      blobURLs,
      componentName,
      mainBlobURL,
    };
  }

  async onMessage() {
    if (this.event.origin !== "http://localhost:3000") return;

    const { componentName, mainBlobURL } = this.parseData();

    this.writeDocument(componentName, mainBlobURL);

    await this.postParentMessage();
    this.blobHandler.revokeObjectURLs(this.blobURLs);
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
  private writeDocument(componentName: string | null, mainBlobURL: string) {
    const writer = new DocumentWriter(mainBlobURL, componentName);

    writer.writeDocument();
  }
}
