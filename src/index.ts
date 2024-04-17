/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { MessageHandler } from "./scripts/message/index";
import { WatchCSP } from "./scripts/observer";

class IframeWorker {
  // eslint-disable-next-line class-methods-use-this
  run() {
    this.configure();
    // eslint-disable-next-line no-console
    console.log("iframe worker is running");
  }

  // eslint-disable-next-line class-methods-use-this

  private async configure() {
    // eslint-disable-next-line no-new
    const cspObserver = new WatchCSP();
    const messageHandler = new MessageHandler();

    cspObserver.watchCSP().catch(async (_) => {
      await messageHandler.forceStop();
    });
    messageHandler.start();
  }
}

const worker = new IframeWorker();

worker.run();
