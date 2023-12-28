var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function onMessage(event) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Message received", event);
        if (event.origin !== "http://localhost:3000") {
            console.log("Message not from localhost:3000");
            return;
        }
        const data = JSON.parse(event.data);
        const mainFile = data[0];
        if (!event.source)
            throw new Error("No event source");
        document.open();
        document.write(mainFile.content);
        document.close();
        console.log("Message sent", event.source);
        const message = JSON.stringify({
            height: 800,
        });
        event.source.postMessage(message, {
            targetOrigin: event.origin,
        });
    });
}
function init() {
    window.addEventListener("message", onMessage, false);
}
init();
export {};
//# sourceMappingURL=index.js.map