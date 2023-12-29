var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class RenderObserver {
    constructor() {
        this.MAX_HEIGHT = 800;
        this.MIN_HEIGHT = 100;
        this.OBSERVER_OPTIONS = {
            attributes: true,
            childList: true,
            subtree: true,
        };
    }
    stopCompleteRendered() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = document.querySelector("body");
            const height = body.offsetHeight;
            return new Promise((resolve) => {
                const observer = new MutationObserver(() => {
                    const newHeight = body.offsetHeight;
                    if (height !== newHeight) {
                        const correctHeight = Math.min(Math.max(newHeight, this.MIN_HEIGHT), this.MAX_HEIGHT);
                        resolve(correctHeight);
                        observer.disconnect();
                    }
                });
                observer.observe(body, this.OBSERVER_OPTIONS);
            });
        });
    }
}
//# sourceMappingURL=index.js.map