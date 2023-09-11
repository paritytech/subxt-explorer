import { Component, createSignal } from "solid-js";
import { greet } from "subxt_example_codegen";

import "./StartPageMainSection.css";

type MetadataSource =
  | {
      tag: "url";
      url?: string;
    }
  | {
      tag: "file";
      file: "idk";
    };

interface Props {}
export const StartPageMainSection: Component<Props> = (props: Props) => {
  let [tab, setTab] = createSignal<"file" | "url">("url");

  let [url, setUrl] = createSignal<string>("http://127.0.0.1:9933");

  return (
    <>
      <h1>Subxt Node Explorer</h1>
      Get metadata from a URL or a file:
      <div></div>
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      Here you can paste a url, to get started:
      <div></div>
      <div>
        <button
          class={`tab ${tab() == "url" ? "active" : ""}`}
          onClick={() => setTab("url")}
        >
          Url
        </button>
        <button
          class={`tab ${tab() == "file" ? "active" : ""}`}
          onClick={() => setTab("file")}
        >
          File
        </button>
      </div>
      <div class="source-container">
        {" "}
        {tab() == "url" && (
          <div>
            <input
              class="w-full"
              type="text"
              value={url()}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </div>
        )}
        {tab() == "file" && <div class={`file-drop-area`}>File</div>}
      </div>
      <div>
        <button> Generate Docs </button>
      </div>
    </>
  );
};
