type Extension = "html" | "css" | "js" | "jsx" | "ts" | "tsx";
export const HTML_MIME_TYPE = "text/html" as const;
export const CSS_MIME_TYPE = "text/css" as const;
export const JAVASCRIPT_MIME_TYPE = "text/javascript" as const;

export const RELOAD_ACTION = "reload" as const;
export const RENDER_ACTION = "render" as const;

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

export type MessageAction = typeof RELOAD_ACTION | typeof RENDER_ACTION;

export type SuccessTransformedData =
  | {
      componentName: string | null;
      files: TransformedFile[];
      action: Extract<MessageAction, "render">;
    }
  | {
      action: Extract<MessageAction, "reload">;
    };

export type BlobInfo = {
  url: string;
  extension: Extension;
};
