/* eslint-disable class-methods-use-this */
import { BlobInfo, TransformedFile } from "../../types/index";

export class BlobHandler {
  createObjectURs(files: TransformedFile[]): BlobInfo[] {
    return files.map((file) => {
      const blob = new Blob([file.content], { type: file.mimeType });

      return {
        url: URL.createObjectURL(blob),
        extension: file.extension,
      };
    });
  }

  revokeObjectURLs(urls: string[]) {
    urls.forEach((url) => URL.revokeObjectURL(url));
  }
}
