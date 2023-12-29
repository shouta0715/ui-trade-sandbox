import {
  BlobInfo,
  SuccessTransformedData,
  TransformedFile,
} from "../../types/index";
import { BlobHandler } from "../blob/index";
import { DocumentWriter } from "../dom/index";
import { RenderObserver } from "../observer/index";

export class MessageHandler {
  private renderObserver: RenderObserver;

  private blobHandler: BlobHandler;

  private blobs: BlobInfo[] = [];

  private cleanups: (() => void)[] = [];

  private componentName: string | null = null;

  private mainBlobURL: string = "";

  private files: TransformedFile[] = [];

  constructor() {
    this.renderObserver = new RenderObserver();
    this.blobHandler = new BlobHandler();
    this.onMessage = this.onMessage.bind(this);

    this.configure();
  }

  private parseData(event: MessageEvent) {
    const data = JSON.parse(event.data) as SuccessTransformedData;

    const blobs = this.blobHandler.createObjectURs(
      data.action === "render" ? data.files : this.files
    );

    this.blobs = blobs;
    this.mainBlobURL = blobs[0].url;
    if (data.action !== "render") return { action: data.action };

    this.componentName = data.componentName;

    this.files = data.files;

    return {
      blobs,
      componentName: data.componentName,
      mainBlobURL: blobs[0].url,
      action: data.action,
    };
  }

  async onMessage(event: MessageEvent) {
    if (event.origin !== "http://localhost:3000") return;

    const data = this.parseData(event);

    if (data.action === "reload") {
      this.reWriteDocument();
      await this.reloadPostParentMessage(event);

      this.blobHandler.revokeObjectURLs(this.blobs.map((blob) => blob.url));
      this.cleanups.forEach((cleanup) => cleanup());

      return;
    }

    this.writeDocument();

    await this.renderPostParentMessage(event);
    this.blobHandler.revokeObjectURLs(this.blobs.map((blob) => blob.url));
    this.cleanups.forEach((cleanup) => cleanup());
  }

  private async renderPostParentMessage(event: MessageEvent) {
    if (!event.source) throw new Error("No event source");

    const height = await this.renderObserver.stopCompleteRendered();

    const message = JSON.stringify({
      height,
      message: "rendered",
    });

    event.source.postMessage(message, {
      targetOrigin: event.origin,
    });
  }

  private async reloadPostParentMessage(event: MessageEvent) {
    if (!event.source) throw new Error("No event source");

    await this.renderObserver.stopCompleteRendered();

    const message = JSON.stringify({
      message: "reload",
    });

    event.source.postMessage(message, {
      targetOrigin: event.origin,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private writeDocument() {
    const writer = new DocumentWriter(
      "render",
      this.mainBlobURL,
      this.componentName,
      this.blobs
    );

    const cleanups = writer.writeDocument();

    cleanups.forEach((cleanup) => this.cleanups.push(cleanup));
  }

  private reWriteDocument() {
    const writer = new DocumentWriter(
      "reload",
      this.mainBlobURL,
      this.componentName,
      this.blobs
    );

    const cleanups = writer.writeDocument();

    cleanups.forEach((cleanup) => this.cleanups.push(cleanup));
  }

  private configure() {
    window.addEventListener("message", this.onMessage, false);
  }
}
