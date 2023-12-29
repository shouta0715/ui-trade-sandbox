/* eslint-disable class-methods-use-this */
import { TransformedFile } from "../../types/index";

export class BlobHandler {
  createObjectURs(files: TransformedFile[]): string[] {
    return files.map((file) => {
      const content =
        file.originallyExtension === "jsx" || file.originallyExtension === "tsx"
          ? `import React from "https://esm.sh/react";\n${file.content}`
          : file.content;

      const blob = new Blob([content], { type: file.mimeType });

      return URL.createObjectURL(blob);
    });
  }

  revokeObjectURLs(blobURLs: string[]) {
    blobURLs.forEach((blobURL) => URL.revokeObjectURL(blobURL));
  }
}
