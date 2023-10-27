import {
  Accessor,
  Component,
  JSX,
  Ref,
  Setter,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { DEFAULT_WS_URL } from "../constants";
import { ClientKind, client, initAppState, setClient } from "../state/client";
import { FileUploadArea } from "../components/FileUploadArea";
import { TabLayout, TabWithContent } from "../components/TabLayout";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { AppConfig, clientKindsEqual } from "../state/app_config";
import {
  findInSidebarItems,
  findSideBarItemByPath,
  itemKindToPath,
  setActiveItem,
  setSidebarVisibility,
} from "../state/sidebar";

/**
 * A singleton class for the HomePage State.
 * Actually controls quite a bit of the entire app state.
 * Makes it easy to set fields from other locations.
 */
export class HomePageState {
  // UI state of the home page:
  file: Accessor<File | undefined>;
  setFile: Setter<File | undefined>;
  error: Accessor<string | undefined>;
  setError: Setter<string | undefined>;
  tab: Accessor<"file" | "url">;
  setTab: Setter<"file" | "url">;
  url: Accessor<string>;
  setUrl: Setter<string>;
  loadingState: Accessor<"none" | "loading">;
  setLoadingState: Setter<"none" | "loading">;

  // infused by a scope that has access to the router.
  #setSearchParams?: (params: Record<string, string>) => void;
  #navigate?: (path: string) => void;

  infuseNavigationFns(
    setSearchParams: (params: Record<string, string>) => void,
    navigate: (path: string) => void
  ) {
    this.#setSearchParams = setSearchParams;
    this.#navigate = navigate;
  }

  constructor() {
    let [file, setFile] = createSignal<File | undefined>(undefined);
    this.file = file;
    this.setFile = setFile;
    let [error, setError] = createSignal<string | undefined>(undefined);
    this.error = error;
    this.setError = setError;
    let [tab, setTab] = createSignal<"file" | "url">("url");
    this.tab = tab;
    this.setTab = setTab;
    let [url, setUrl] = createSignal<string>(DEFAULT_WS_URL);
    this.url = url;
    this.setUrl = setUrl;
    let [loadingState, setLoadingState] = createSignal<"none" | "loading">(
      "none"
    );
    this.loadingState = loadingState;
    this.setLoadingState = setLoadingState;
  }

  // singleton pattern
  static #instance: HomePageState;
  static get instance(): HomePageState {
    if (HomePageState.#instance === undefined) {
      HomePageState.#instance = new HomePageState();
    }
    return HomePageState.#instance;
  }

  // takes the state of the ui elements and translates that into a clientKind that can be used to create a client.
  clientKindFromTab = (): ClientKind | undefined => {
    if (this.error() !== undefined) {
      return undefined;
    }
    if (this.tab() === "file" && this.file() !== undefined) {
      return { tag: "file", file: this.file()! };
    } else if (this.tab() === "url" && this.url()) {
      return { tag: "url", url: this.url() };
    }
    return undefined;
  };

  // a signal that is true if the generate button is clickable.
  generateButtonClickable = (): boolean => {
    return this.loadingState() === "none" && !!this.clientKindFromTab();
  };

  async generateAndUpdateAppConfig() {
    let clientKind = this.clientKindFromTab();
    if (clientKind === undefined || this.#setSearchParams === undefined) {
      return;
    }
    AppConfig.instance = new AppConfig(clientKind);
    this.#setSearchParams!(AppConfig.instance.toParams());
    await this.#generate(clientKind);
  }

  async #generate(clientKind: ClientKind) {
    this.setError(undefined);
    console.log("kick of generate for appConfig:", AppConfig.instance);
    this.setLoadingState("loading");
    try {
      await initAppState(clientKind);
      setSidebarVisibility("visible");
      this.maybeRedirect();
    } catch (ex: any) {
      this.setError(ex.toString());
    }
    this.setLoadingState("none");
  }

  // if the redirectPath is set, redirect to that path.
  maybeRedirect() {
    if (this.#redirectPath) {
      //  if redirect query param set, navigate to the correct page:
      let sidebarItem = findSideBarItemByPath(this.#redirectPath);
      console.log("wants to redirect to", this.#redirectPath, sidebarItem);
      if (sidebarItem === null) {
        this.setError(
          `Cannot redirect to ${this.#redirectPath}. It is not a valid page.`
        );
      } else {
        setActiveItem(sidebarItem!);
        let sanitizedRedirectPath = itemKindToPath(sidebarItem!.kind);
        let paramsString = AppConfig.instance.toParamsString();
        console.log("paramsString", paramsString);
        let completeRedirectPath = `${sanitizedRedirectPath}?${paramsString}`;
        console.log("GENERATE REDIRECT: redirecting to", completeRedirectPath);
        this.#navigate!(completeRedirectPath);
      }

      this.#redirectPath = undefined;
    }
  }

  #redirectPath: string | undefined = undefined;
  setRedirectPath = (path: string) => {
    this.#redirectPath = path;
  };

  // used on:
  // - page load
  // - when the url params change and the AppConfig changes as a result.
  adjustUiToAppConfigInstance() {
    let configClientKind = AppConfig.instance.clientKind;
    if (
      configClientKind != undefined &&
      !clientKindsEqual(configClientKind, client()?.clientKindInCreation)
    ) {
      this.#setSearchParams!(AppConfig.instance.toParams());
      switch (configClientKind.tag) {
        case "url":
          this.setUrl(configClientKind.url);
          this.setTab("url");
          this.#generate(configClientKind);
          break;
        case "file":
          this.setFile(configClientKind.file);
          this.setTab("file");
          this.#generate(configClientKind);
          break;
        default:
          break;
      }
    }
  }
}

export const HomePage: Component = () => {
  let state = HomePageState.instance;
  const [_searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  state.infuseNavigationFns(setSearchParams, navigate);

  let [isDraggingOnUpload, setIsDraggingOnUpload] =
    createSignal<boolean>(false);

  state.adjustUiToAppConfigInstance();

  const urlTabContent = (
    <input
      class="w-full bg-zinc-dark p-2 rounded-md border-2 outline-none focus:border-teal-400 border-solid  border-gray-500 "
      type="text"
      value={state.url()}
      onInput={(e) => {
        state.setUrl(e.target.value);
        state.setError(undefined);
      }}
      onChange={(e) => {
        state.setUrl(e.target.value);
        state.setError(undefined);
      }}
    />
  );

  const fileTabContent = (
    <FileUploadArea
      isDragging={isDraggingOnUpload()}
      setDragging={setIsDraggingOnUpload}
      fileName={state.file()?.name}
      description={`Drag Metadata File here, or click "Upload"`}
      onDropOrUpload={(files) => {
        if (files === undefined) {
          state.setError("Something went wrong with the file upload.");
        } else if (files.length !== 1) {
          state.setError("Please only select a single file.");
        } else {
          state.setFile(files[0]);
          state.setError(undefined);
          // directly generate new docs as soon as it it dragged in.
          state.generateAndUpdateAppConfig();
        }
      }}
    ></FileUploadArea>
  );

  const tabsWithContent: TabWithContent[] = [
    {
      tab: {
        title: "Url",
        active: () => state.tab() == "url",
        onClick: () => {
          state.setTab("url");
          state.setError(undefined);
        },
        icon: "fa-link",
      },
      content: urlTabContent,
    },
    {
      tab: {
        title: "File",
        active: () => state.tab() == "file",
        onClick: () => {
          state.setTab("file");
          state.setError(undefined);
        },
        icon: "fa-file",
      },
      content: fileTabContent,
    },
  ];

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
      {state.error() && (
        <div class="text-center w-full text-red-400 mb-4">{state.error()}</div>
      )}
      <div>
        <button
          class={`btn ${state.generateButtonClickable() ? "" : "disabled"}`}
          disabled={!state.generateButtonClickable()}
          onClick={() => {
            // assumption: Button is only clickable if homeScreenClientKind() is a valid value.
            state.generateAndUpdateAppConfig();
          }}
        >
          {state.loadingState() === "loading" ? (
            <span class="fa fa-spinner mr-3 animate-spin"></span>
          ) : (
            <span class="fa fa-play mr-4"></span>
          )}
          Generate Docs
        </button>
      </div>
      <SubxtExplanationSection />
    </>
  );
};

function SubxtExplanationSection(): JSX.Element {
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
