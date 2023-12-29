/* eslint-disable max-classes-per-file */
class ElementHandler {
  constructor(
    private parent: HTMLElement,
    private position: InsertPosition,
    private code: string
  ) {}

  insertAdjacentCode() {
    const element = document.createElement("script");
    element.textContent = this.code;
    element.type = "module";
    this.parent.insertAdjacentElement(this.position, element);
  }
}

class ReactCodeHandler {
  constructor(
    private blobUrl: string,
    private componentName: string
  ) {}

  getImportStatement() {
    const reactImport = `import React from "https://esm.sh/react";\nimport { render } from "https://esm.sh/react-dom";\n`;

    return `${reactImport}import ${this.componentName} from "${this.blobUrl}";\n`;
  }

  getRenderReact() {
    return `render(React.createElement(${this.componentName},null), document.getElementById("root"));`;
  }
}

export class DocumentWriter {
  constructor(
    private mainBlobURL: string,
    private componentName?: string | null
  ) {}

  private writeHTMLDocument() {}

  private writeReactDocument() {
    if (!this.componentName) throw new Error("No component name");

    const body = document.querySelector("body") as HTMLBodyElement;
    const root = document.createElement("div");
    root.id = "root";

    body.appendChild(root);

    const reactCodeHandler = new ReactCodeHandler(
      this.mainBlobURL,
      this.componentName
    );
    const importStatement = reactCodeHandler.getImportStatement();
    const renderReact = reactCodeHandler.getRenderReact();

    const code = `${importStatement}\n${renderReact}`;

    new ElementHandler(body, "beforeend", code).insertAdjacentCode();
  }

  writeDocument() {
    if (this.componentName === null) {
      this.writeHTMLDocument();
    }

    if (this.componentName !== null) {
      this.writeReactDocument();
    }
  }
}
