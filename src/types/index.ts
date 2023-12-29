type Extension = "html" | "css" | "js" | "jsx" | "ts" | "tsx";
export const HTML_MIME_TYPE = "text/html" as const;
export const CSS_MIME_TYPE = "text/css" as const;
export const JAVASCRIPT_MIME_TYPE = "text/javascript" as const;

type MIMETYPE =
  | typeof HTML_MIME_TYPE
  | typeof CSS_MIME_TYPE
  | typeof JAVASCRIPT_MIME_TYPE;

export type TransformedFile = {
  content: string;
  mimeType: MIMETYPE;
  extension: Extension;
  originallyExtension?: Extension;
};

export type SuccessTransformedData = {
  componentName: string | null;
  files: TransformedFile[];
};

export type BlobInfo = {
  url: string;
  extension: Extension;
};
