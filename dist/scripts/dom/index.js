class ElementHandler {
    constructor(parent, position, code) {
        this.parent = parent;
        this.position = position;
        this.code = code;
    }
    insertAdjacentCode() {
        const element = document.createElement("script");
        element.textContent = this.code;
        element.type = "module";
        this.parent.insertAdjacentElement(this.position, element);
    }
}
class ReactCodeHandler {
    constructor(blobUrl, componentName) {
        this.blobUrl = blobUrl;
        this.componentName = componentName;
    }
    getImportStatement() {
        const reactImport = `import React from "https://esm.sh/react";\nimport { render } from "https://esm.sh/react-dom";\n`;
        return `${reactImport}import ${this.componentName} from "${this.blobUrl}";\n`;
    }
    getRenderReact() {
        return `render(React.createElement(${this.componentName},null), document.getElementById("root"));`;
    }
}
export class DocumentWriter {
    constructor(mainBlobURL, componentName) {
        this.mainBlobURL = mainBlobURL;
        this.componentName = componentName;
    }
    writeHTMLDocument() { }
    writeReactDocument() {
        if (!this.componentName)
            throw new Error("No component name");
        const body = document.querySelector("body");
        const root = document.createElement("div");
        root.id = "root";
        body.appendChild(root);
        const reactCodeHandler = new ReactCodeHandler(this.mainBlobURL, this.componentName);
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
//# sourceMappingURL=index.js.map