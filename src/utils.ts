import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import rust from "highlight.js/lib/languages/rust";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("rust", rust);

export function highlight(code: string): string {
  return hljs.highlight(code, {
    language: "rust",
  }).value;
}

export async function readFileAsBytes(file: File): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const arrayBuffer = event?.target?.result;
      if (arrayBuffer instanceof ArrayBuffer) {
        res(new Uint8Array(arrayBuffer));
      } else {
        rej("event?.target?.result is not ArrayBuffer");
      }
    };

    fileReader.onerror = (event) => {
      // Reject the promise if there's an error
      rej(`some error occurred: ${event?.target?.error}`);
    };

    // Read the file as an ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  });
}
