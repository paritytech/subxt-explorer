import { Component, JSX, Ref, createEffect, createSignal } from "solid-js";
import { DEFAULT_WS_URL } from "../constants";
import {
  ClientKind,
  fetchMetadataAndInitState,
  setAppState,
} from "../state/app_state";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { DebugComponent } from "../components/DebugComponent";
import { FileUploadArea } from "../components/FileUploadArea";
import { TabLayout, TabWithContent } from "../components/TabLayout";
import { useSearchParams } from "@solidjs/router";
import { appConfig, setClientKindOfAppConfig } from "../state/app_config";
// import { appConfig } from "../state/app_config";

interface Props {}
export const HomePage: Component<Props> = (props: Props) => {
  /// Signals

  let [file, setFile] = createSignal<File | undefined>(undefined);

  let [error, setError] = createSignal<string | undefined>(undefined);

  let [isDraggingOnUpload, setIsDraggingOnUpload] =
    createSignal<boolean>(false);

  let [tab, setTab] = createSignal<"file" | "url">("url");
  let [url, setUrl] = createSignal<string>(DEFAULT_WS_URL);
  let [loadingState, setLoadingState] = createSignal<"none" | "loading">(
    "none"
  );

  const clientKind = (): ClientKind | undefined => {
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

  const generateDocsButtonClickable = (): boolean => {
    return loadingState() === "none" && !!clientKind();
  };

  /// State Managements

  const [_searchParams, setSearchParams] = useSearchParams();
  /**
   * # Panics
   *
   * Panics if metadataSource === undefined
   */
  async function generateDocs() {
    setLoadingState("loading");
    let kind = clientKind()!;
    setClientKindOfAppConfig(kind, setSearchParams);
    try {
      await fetchMetadataAndInitState(kind);
    } catch (ex: any) {
      setError(ex.toString());
    }
    setLoadingState("none");
  }

  // on home screen load: if the appConfig is not undefined, set up the ui on this page in the right way and generate the docs
  let configClientKind = appConfig().clientKind;
  console.log(configClientKind);
  if (configClientKind != undefined) {
    switch (configClientKind.tag) {
      case "url":
        setUrl(configClientKind.url);
        setTab("url");
        generateDocs();
        break;
      case "file":
        throw "Should not get here, appConfig should never have file as a clientKind";
        break;
    }
  } else {
    setTab("url");
    setUrl(DEFAULT_WS_URL);
  }

  const urlTabContent = (
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
  );

  const fileTabContent = (
    <FileUploadArea
      isDragging={isDraggingOnUpload()}
      setDragging={setIsDraggingOnUpload}
      fileName={file()?.name}
      description={`Drag Metadata File here, or click "Upload"`}
      onDropOrUpload={(files) => {
        if (files === undefined) {
          setError("Something went wrong with the file upload.");
        } else if (files.length !== 1) {
          setError("Please only select a single file.");
        } else {
          setFile(files[0]);
          setError(undefined);
          // directly generate new docs as soon as it it dragged in.
          generateDocs();
        }
      }}
    ></FileUploadArea>
  );

  const tabsWithContent: TabWithContent[] = [
    {
      tab: {
        title: "Url",
        active: () => tab() == "url",
        onClick: () => {
          setTab("url");
          setError(undefined);
        },
        icon: "fa-link",
      },
      content: urlTabContent,
    },
    {
      tab: {
        title: "File",
        active: () => tab() == "file",
        onClick: () => {
          setTab("file");
          setError(undefined);
        },
        icon: "fa-file",
      },
      content: fileTabContent,
    },
  ];

  /// JSX
  return (
    <>
      <h1>Subxt Explorer</h1>
      Ever wondered how to interact with a custom substrate node using Subxt?
      Upload a scale encoded metadata file or input a substrate node url to get
      started:
      <div></div>
      <TabLayout
        tabs={tabsWithContent}
        tabsContainerClass="mt-5"
        contentContainerClass="py-5 my-5"
      ></TabLayout>
      {error() && (
        <div class="text-center w-full text-red-400 mb-4">{error()}</div>
      )}
      <div>
        <button
          class={`btn ${generateDocsButtonClickable() ? "" : "disabled"}`}
          disabled={!generateDocsButtonClickable()}
          onClick={generateDocs}
        >
          {loadingState() === "loading" ? (
            <span class="fa fa-spinner mr-3 animate-spin"></span>
          ) : (
            <span class="fa fa-play mr-4"></span>
          )}
          Generate Docs{" "}
        </button>
      </div>
      {subxtExplanationSection()}
    </>
  );
};

function subxtExplanationSection(): JSX.Element {
  return (
    <div>
      <h2>Subxt - Interact with Substrate-based Blockchains</h2>
      Subxt is a library to <strong class="text-pink-500">sub</strong>mit{" "}
      <strong class="text-pink-500">ex</strong>trinsics to a substrate node via
      RPC. You can find more info about Subxt on Github:
      <div class="mt-3">
        <a href="https://github.com/paritytech/subxt">
          <span class="fa fa-github mr-3"></span>Subxt on Github
        </a>
      </div>
    </div>
  );
}
