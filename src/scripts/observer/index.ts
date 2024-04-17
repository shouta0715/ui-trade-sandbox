// eslint-disable-next-line max-classes-per-file
export class RenderObserver {
  private MAX_HEIGHT = 600;

  private MIN_HEIGHT = 200;

  private OBSERVER_OPTIONS: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  // eslint-disable-next-line class-methods-use-this
  async stopCompleteRendered(): Promise<number> {
    // bodyの高さが変わるまで待つ

    const body = document.querySelector("body") as HTMLBodyElement;

    const height = body.offsetHeight;

    return new Promise<number>((resolve) => {
      const observer = new MutationObserver(() => {
        const newHeight = body.offsetHeight;

        if (height <= newHeight) {
          const correctHeight = Math.min(
            Math.max(newHeight, this.MIN_HEIGHT),
            this.MAX_HEIGHT
          );

          resolve(correctHeight);

          observer.disconnect();
        }
      });

      observer.observe(body, this.OBSERVER_OPTIONS);
    });
  }
}
export class WatchCSP {
  private CSP_ID = "csp";

  watchCSP(): Promise<void> {
    return new Promise((_, reject) => {
      const observer = new MutationObserver((__, ob) => {
        // DOM内の変更を検出したときの処理
        const csp = document.getElementById(this.CSP_ID);
        if (!csp) {
          ob.disconnect(); // 監視を停止
          reject(new Error("CSP is removed")); // エラーをPromiseの拒否として扱う
        }
      });

      observer.observe(document.head || document.documentElement, {
        childList: true, // 子要素の追加や削除を監視
        subtree: true, // 対象要素の全サブツリーを監視
      });
    });
  }
}
