import { Component, Ref, createSignal } from "solid-js";
import { DEFAULT_WS_URL } from "../constants";
import {
  MetadataSource,
  fetchMetadataAndInitState,
  setAppState,
} from "../state/app_state";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { DebugComponent } from "../components/DebugComponent";
import { FileUploadArea } from "../components/FileUploadArea";
import { TabLayout, TabWithContent } from "../components/TabLayout";

interface Props {}
export const HomePage: Component<Props> = (props: Props) => {
  let fileInputRef: HTMLInputElement | undefined;

  /// Signals

  let [tab, setTab] = createSignal<"file" | "url">("url");

  let [url, setUrl] = createSignal<string>(DEFAULT_WS_URL);

  let [file, setFile] = createSignal<File | undefined>(undefined);

  let [loadingState, setLoadingState] = createSignal<"none" | "loading">(
    "none"
  );

  let [error, setError] = createSignal<string | undefined>(undefined);

  let [isDraggingOnUpload, setIsDraggingOnUpload] =
    createSignal<boolean>(false);

  const metadataSource = (): MetadataSource | undefined => {
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
    return loadingState() === "none" && !!metadataSource();
  };

  /// State Managements

  /**
   * # Panics
   *
   * Panics if metadataSource === undefined
   */
  async function onGenerateDocsButtonClick() {
    setLoadingState("loading");
    try {
      await fetchMetadataAndInitState(metadataSource()!);
    } catch (ex: any) {
      setError(ex.toString());
    }
    setLoadingState("none");
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
    <MdBookWrapper>
      <DebugComponent></DebugComponent>
      <h1>Subxt Node Explorer</h1>
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
          onClick={onGenerateDocsButtonClick}
        >
          {loadingState() === "loading" ? (
            <span class="fa fa-spinner mr-3 animate-spin"></span>
          ) : (
            <span class="fa fa-play mr-4"></span>
          )}
          Generate Docs{" "}
        </button>
      </div>
    </MdBookWrapper>
  );
};
