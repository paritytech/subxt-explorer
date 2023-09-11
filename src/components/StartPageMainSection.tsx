import { Component, Ref, createSignal } from "solid-js";
import { greet } from "subxt_example_codegen";

type MetadataSource =
  | {
      tag: "url";
      url: string;
    }
  | {
      tag: "file";
      file: File;
    };

interface Props {}
export const StartPageMainSection: Component<Props> = (props: Props) => {
  let fileInputRef: HTMLInputElement | undefined;

  let [tab, setTab] = createSignal<"file" | "url">("file");

  let [url, setUrl] = createSignal<string>("http://127.0.0.1:9933");

  let [file, setFile] = createSignal<File | undefined>(undefined);

  let [loadingState, setLoadingState] = createSignal<"none" | "loading">(
    "none"
  );

  let [error, setError] = createSignal<string | undefined>(undefined);

  let [draggingOnField, setDraggingOnField] = createSignal<boolean>(false);

  const urlOrFile = (): MetadataSource | undefined => {
    if (error() !== undefined) {
      return undefined;
    }
    if (tab() === "file" && file() !== undefined) {
      return { tag: "file", file: file()! };
    } else if (tab() === "url" && url()) {
      return { tag: "url", url: url() };
    }
    return undefined;
  };

  const generateButtonClickable = (): boolean => {
    return loadingState() === "none" && !!urlOrFile();
  };

  /**
   * # Panics
   *
   * Panics if urlOrFile === undefined
   */
  async function loadMetadataAndGenerateDocs() {
    setLoadingState("loading");
    let source = urlOrFile()!;
    switch (source.tag) {
      case "url":
        // todo! load from ws or http
        break;
      case "file":
        let bytes = await readFileAsBytes(source.file);
        console.log(bytes);
        break;
    }
    setLoadingState("none");
  }

  return (
    <>
      <h1>Subxt Node Explorer</h1>
      Ever wondered how to interact with a custom substrate node using Subxt?
      Upload a scale encoded metadata file or input a substrate node url to get
      started:
      <div></div>
      <div class="mt-5">
        {Tab("Url", tab() == "url", () => setTab("url"), "fa-link")}
        {Tab("File", tab() == "file", () => setTab("file"), "fa-file")}
      </div>
      <div class="py-5 my-5">
        {" "}
        {tab() == "url" && (
          <input
            class="w-full bg-zinc-dark p-2 rounded-md border-2 outline-none focus:border-teal-400 border-solid  border-gray-500 "
            type="text"
            value={url()}
            onInput={(e) => {
              setUrl(e.target.value);
              setError(undefined);
            }}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(undefined);
            }}
          />
        )}
        {tab() == "file" && (
          <div
            class={`w-full h-60 border-dashed border-2 rounded-md border-gray-500 flex justify-center bg-zinc-dark ${
              draggingOnField() ? "neon-inner-shadow" : ""
            }`}
            onDragEnter={(e) => {
              setDraggingOnField(true);
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              setDraggingOnField(false);
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragExit={(e) => {
              setDraggingOnField(false);
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              setDraggingOnField(false);
              e.preventDefault();
              e.stopPropagation();
              const files = e.dataTransfer?.files;
              if (files === undefined) {
                setError("Something went wrong when dragging the file in.");
              } else if (files.length !== 1) {
                setError("Please only drag in a single file.");
              } else {
                setFile(files[0]);
                setError(undefined);
              }
            }}
          >
            <div class="self-center text-center pointer-events-none">
              <div class="text-teal-300 italic">{file() && file()?.name}</div>
              <div> Drag Metadata File here, or click "Upload"</div>
              <button
                class="btn mt-3 bg-zinc-600 pointer-events-auto hover:bg-zinc-500"
                onClick={() => {
                  fileInputRef!.click();
                }}
              >
                Upload
              </button>
              <input
                type="file"
                ref={fileInputRef}
                class="hidden"
                onChange={(e) => {
                  console.log(e);
                  const files = e?.target?.files;
                  if (files === null) {
                    setError("Something went wrong with the file upload.");
                  } else if (files.length !== 1) {
                    setError("Please only select a single file.");
                  } else {
                    setFile(files[0]);
                    setError(undefined);
                  }
                }}
              ></input>
            </div>
          </div>
        )}
      </div>
      {error() && (
        <div class="text-center w-full text-red-400 mb-4">{error()}</div>
      )}
      <div>
        <button
          class={`btn ${generateButtonClickable() ? "" : "disabled"}`}
          disabled={!generateButtonClickable()}
          onClick={loadMetadataAndGenerateDocs}
        >
          <span class="fa fa-play mr-2"></span> Generate Docs{" "}
        </button>
      </div>
    </>
  );
};

function Tab(
  title: string,
  active: boolean,
  onClick: () => void,
  faClass: `fa-${string}`
) {
  return (
    <button
      class={`font-bold border-none rounded-md px-4 py-2 mr-4  ${
        active ? "bg-teal-500" : "bg-zinc-dark hover:bg-zinc-600"
      }`}
      onClick={onClick}
    >
      <span class={`fa ${faClass} mr-2`}></span> {title}
    </button>
  );
}

async function readFileAsBytes(file: File) {
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
