/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { MessageHandler } from "./scripts/message/index";

class IframeWorker {
  // eslint-disable-next-line class-methods-use-this
  run() {
    this.configure();
    // eslint-disable-next-line no-console
    console.log("iframe worker is running");
  }

  // eslint-disable-next-line class-methods-use-this
  private eventHandler(event: MessageEvent) {
    const handler = new MessageHandler(event);

    return handler.onMessage();
  }

  private configure() {
    window.addEventListener("message", this.eventHandler, false);
  }
}

const worker = new IframeWorker();

worker.run();
