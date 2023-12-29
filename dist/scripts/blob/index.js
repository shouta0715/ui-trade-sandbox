export class BlobHandler {
    createObjectURs(files) {
        return files.map((file) => {
            const content = file.originallyExtension === "jsx" || file.originallyExtension === "tsx"
                ? `import React from "https://esm.sh/react";\n${file.content}`
                : file.content;
            const blob = new Blob([content], { type: file.mimeType });
            return URL.createObjectURL(blob);
        });
    }
    revokeObjectURLs(blobURLs) {
        blobURLs.forEach((blobURL) => URL.revokeObjectURL(blobURL));
    }
}
//# sourceMappingURL=index.js.map