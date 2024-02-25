/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { BlobInfo, ExportStyle, MessageAction } from "../../types";
import { BlobHandler } from "../blob";

class ElementHandler {
  constructor(
    private position: InsertPosition,
    private code?: string,
    private parent: HTMLElement | null = null
  ) {}

  insertAdjacentCode(cn?: (h: HTMLScriptElement) => void) {
    const body = document.querySelector("body") as HTMLBodyElement;
    const element = document.createElement("script");

    element.type = "module";
    element.defer = true;

    cn?.(element);
    body.insertAdjacentElement(this.position, element);
  }

  insertAdjacentHTML() {
    if (this.parent === null) throw new Error("No parent");

    if (!this.code) throw new Error("No code");

    this.parent.insertAdjacentHTML(this.position, this.code);
  }
}

class ReactCodeHandler {
  constructor(
    private blobUrl: string,
    private componentName: string,
    private exportStyle: ExportStyle
  ) {}

  private getImportStatement() {
    const reactImport = `import React from "https://esm.sh/react";\nimport { render } from "https://esm.sh/react-dom";\n`;

    if (this.exportStyle === "default") {
      return `${reactImport}import ${this.componentName} from "${this.blobUrl}";\n`;
    }

    return `${reactImport}import { ${this.componentName} } from "${this.blobUrl}";\n`;
  }

  private getRenderReact() {
    return `render(React.createElement(${this.componentName},null), document.getElementById("root"));`;
  }

  renderReact() {
    const root = document.querySelector("#root") as HTMLDivElement;

    if (!root) throw new Error("No root");

    const importStatement = this.getImportStatement();
    const renderReact = this.getRenderReact();

    const code = `${importStatement}\n${renderReact}`;

    return code;
  }
}

export class DocumentWriter {
  private cleanups: (() => void)[] = [];

  constructor(
    private action: MessageAction,
    private mainBlobURL: string,
    private componentName?: string | null,
    private exportStyle?: ExportStyle | null,
    private blobs: BlobInfo[] = []
  ) {}

  private insertCSS(url: string) {
    const parent = document.querySelector("head") as HTMLHeadElement;
    const element = document.createElement("link");
    element.rel = "stylesheet";
    element.href = url;

    new ElementHandler(
      "beforeend",
      element.outerHTML,
      parent
    ).insertAdjacentHTML();
  }

  private insertJS(url: string) {
    const cn = (el: HTMLScriptElement) => {
      el.src = url;
    };

    new ElementHandler("beforeend").insertAdjacentCode(cn);
  }

  private insertAssets(assets: (BlobInfo & { content: string })[]) {
    assets.forEach((asset) => {
      if (asset.extension === "css") this.insertCSS(asset.url);

      if (asset.extension === "js") this.insertJS(asset.url);
    });
  }

  private async writeHTMLDocument() {
    const [blobHTML, ...others] = await Promise.all(
      this.blobs.map((blob) =>
        fetch(blob.url).then(async (res) => {
          if (!res.ok) throw new Error("Blob not found");

          const content = await res.text();

          return {
            extension: blob.extension,
            content,
            url: blob.url,
            id: blob.id,
          };
        })
      )
    );

    const html = new DOMParser().parseFromString(blobHTML.content, "text/html");
    const root = document.querySelector("#root") as HTMLDivElement;

    if (!root) throw new Error("No root");

    const inputBody = html.querySelector("body") as HTMLBodyElement;

    const elementHandler = new ElementHandler(
      "beforeend",
      inputBody.innerHTML,
      root
    );

    elementHandler.insertAdjacentHTML();
    this.insertAssets(others);
  }

  private writeReactDocument() {
    if (!this.componentName) throw new Error("No component name");
    if (!this.exportStyle) throw new Error("No export style");

    const reactCodeHandler = new ReactCodeHandler(
      this.mainBlobURL,
      this.componentName,
      this.exportStyle
    );

    const code = reactCodeHandler.renderReact();
    const blobHandler = new BlobHandler();

    const [blob] = blobHandler.createObjectURs([
      {
        content: code,
        extension: "js",
        mimeType: "text/javascript",
        id: "react",
      },
    ]);

    this.insertJS(blob.url);
    this.cleanups.push(() => blobHandler.revokeObjectURLs([blob.url]));
  }

  private reWriteDocument() {
    const body = document.querySelector("body") as HTMLBodyElement;

    if (!body) throw new Error("No app");

    const scripts = body.querySelectorAll("script");

    scripts.forEach((script) => {
      if (!script.src.startsWith("blob")) return;

      script.remove();
    });

    if (this.componentName === null) {
      const root = document.querySelector("#root") as HTMLDivElement;
      root.innerHTML = "";

      this.writeHTMLDocument();

      return this.cleanups;
    }

    if (this.componentName !== null) {
      this.writeReactDocument();

      return this.cleanups;
    }

    return this.cleanups;
  }

  writeDocument() {
    if (this.action === "reload") {
      if (!this.mainBlobURL) throw new Error("No main blob url");

      this.reWriteDocument();

      return this.cleanups;
    }

    if (this.componentName === null) {
      this.writeHTMLDocument();

      return this.cleanups;
    }

    if (this.componentName !== null) {
      this.writeReactDocument();

      return this.cleanups;
    }

    return this.cleanups;
  }
}
