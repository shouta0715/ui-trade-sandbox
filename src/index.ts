import { FileObject } from "./types/index";

async function onMessage(event: MessageEvent) {
  console.log("Message received", event);
  if (event.origin !== "http://localhost:3000") {
    console.log("Message not from localhost:3000");

    return;
  }

  const data = JSON.parse(event.data) as FileObject[];

  const mainFile = data[0];

  if (!event.source) throw new Error("No event source");

  document.open();

  document.write(mainFile.content);

  document.close();

  console.log("Message sent", event.source);
  const message = JSON.stringify({
    height: 800,
  });

  event.source.postMessage(message, {
    targetOrigin: event.origin,
  });
}

function init() {
  window.addEventListener("message", onMessage, false);
}

init();
