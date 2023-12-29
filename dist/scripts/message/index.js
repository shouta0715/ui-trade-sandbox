var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BlobHandler } from "../blob/index";
import { DocumentWriter } from "../dom/index";
import { RenderObserver } from "../observer/index";
export class MessageHandler {
    constructor(event) {
        this.event = event;
        this.blobURLs = [];
        this.renderObserver = new RenderObserver();
        this.blobHandler = new BlobHandler();
    }
    parseData() {
        const { files, componentName } = JSON.parse(this.event.data);
        const blobURLs = this.blobHandler.createObjectURs(files);
        this.blobURLs = blobURLs;
        const mainBlobURL = blobURLs[0];
        return {
            blobURLs,
            componentName,
            mainBlobURL,
        };
    }
    onMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.event.origin !== "http://localhost:3000")
                return;
            const { componentName, mainBlobURL } = this.parseData();
            this.writeDocument(componentName, mainBlobURL);
            yield this.postParentMessage();
            this.blobHandler.revokeObjectURLs(this.blobURLs);
        });
    }
    postParentMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.event.source)
                throw new Error("No event source");
            const height = yield this.renderObserver.stopCompleteRendered();
            const message = JSON.stringify({
                height,
                message: "rendered",
            });
            this.event.source.postMessage(message, {
                targetOrigin: this.event.origin,
            });
        });
    }
    writeDocument(componentName, mainBlobURL) {
        const writer = new DocumentWriter(mainBlobURL, componentName);
        writer.writeDocument();
    }
}
//# sourceMappingURL=index.js.map