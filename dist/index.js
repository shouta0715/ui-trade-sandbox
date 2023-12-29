import { MessageHandler } from "./scripts/message/index";
class IframeWorker {
    run() {
        this.configure();
    }
    eventHandler(event) {
        const handler = new MessageHandler(event);
        return handler.onMessage();
    }
    configure() {
        window.addEventListener("message", this.eventHandler, false);
    }
}
const worker = new IframeWorker();
worker.run();
//# sourceMappingURL=index.js.map