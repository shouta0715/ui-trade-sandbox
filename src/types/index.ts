type Extension = "html" | "css" | "js" | "jsx" | "ts" | "tsx";
export const HTML_MIME_TYPE = "text/html" as const;
export const CSS_MIME_TYPE = "text/css" as const;
export const JAVASCRIPT_MIME_TYPE = "text/javascript" as const;

export const RELOAD_ACTION = "reload" as const;
export const RENDER_ACTION = "render" as const;

export const EXPORT_DEFAULT_STYLE = "default" as const;
export const EXPORT_NAMED_STYLE = "named" as const;

type MIMETYPE =
  | typeof HTML_MIME_TYPE
  | typeof CSS_MIME_TYPE
  | typeof JAVASCRIPT_MIME_TYPE;

export type TransformedFile = {
  content: string;
  mimeType: MIMETYPE;
  extension: Extension;
  originallyExtension?: Extension;
  id: string;
};

export type MessageAction = typeof RELOAD_ACTION | typeof RENDER_ACTION;

export type ExportStyle =
  | typeof EXPORT_DEFAULT_STYLE
  | typeof EXPORT_NAMED_STYLE;

export type SuccessTransformedData =
  | {
      componentName: string | null;
      exportStyle: ExportStyle | null;
      files: TransformedFile[];
      mainFileId: string;
      action: Extract<MessageAction, "render">;
    }
  | {
      action: Extract<MessageAction, "reload">;
      mainFileId: string;
    };

export type BlobInfo = {
  url: string;
  extension: Extension;
  id: string;
};

export type ReceiveData =
  | {
      height?: number;
      error: false;
      action: MessageAction;
    }
  | {
      error: true;
      action: MessageAction | "unknown";
      message: string;
    };
