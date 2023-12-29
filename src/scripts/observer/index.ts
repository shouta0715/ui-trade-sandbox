export class RenderObserver {
  private MAX_HEIGHT = 800;

  private MIN_HEIGHT = 100;

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

        if (height !== newHeight) {
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
