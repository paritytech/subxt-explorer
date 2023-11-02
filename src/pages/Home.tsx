import { Accessor, Component, JSX, Setter, createSignal } from "solid-js";
import { DEFAULT_WS_URL } from "../constants";
import { createClient } from "../state/client";
import { FileUploadArea } from "../components/FileUploadArea";
import { TabLayout, TabWithContent } from "../components/TabLayout";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { AppConfig } from "../state/app_config";
import {
  findSideBarItemByPath,
  itemKindToPath,
  setActiveItem,
  setSidebarVisibility,
} from "../state/sidebar";
import { ChainSpecService } from "../services/chain_spec_service";
import {
  ClientCreationData,
  ClientCreationDataTag,
} from "../state/models/client_creation_data";
import { ClientCreationConfig } from "../state/models/client_creation_config";

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
  tab: Accessor<ClientCreationDataTag>;
  setTab: Setter<ClientCreationDataTag>;
  url: Accessor<string>;
  setUrl: Setter<string>;
  // File, if a file is uploaded. string if a chain name is selected from presets. The string should match the presets chain specs chain_name in that case.
  lightClientChainSpec: Accessor<File | string | undefined>;
  setLightClientChainSpec: Setter<File | string | undefined>;
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
    // set up all the signals that make up the state of the Home page
    const [file, setFile] = createSignal<File | undefined>(undefined);
    this.file = file;
    this.setFile = setFile;
    const [error, setError] = createSignal<string | undefined>(undefined);
    this.error = error;
    this.setError = setError;
    const [tab, setTab] = createSignal<ClientCreationDataTag>("url");
    this.tab = tab;
    this.setTab = setTab;
    const [url, setUrl] = createSignal<string>(DEFAULT_WS_URL);
    this.url = url;
    this.setUrl = setUrl;
    const [lightClientChainSpec, setLightClientChainSpec] = createSignal<
      File | string | undefined
    >(undefined);
    this.lightClientChainSpec = lightClientChainSpec;
    this.setLightClientChainSpec = setLightClientChainSpec;
    const [loadingState, setLoadingState] = createSignal<"none" | "loading">(
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

  get is_loading() {
    return this.loadingState() === "loading";
  }

  // takes the state of the ui elements and translates that into a clientKind that can be used to create a client.
  clientCreationDataFromTab = (): ClientCreationData | undefined => {
    if (this.error() !== undefined) {
      return undefined;
    }

    switch (this.tab()) {
      case "url": {
        const url = this.url();
        if (url === undefined) {
          return undefined;
        }
        return new ClientCreationData({ tag: "url", url });
      }
      case "file": {
        const file = this.file();
        return file && new ClientCreationData({ tag: "file", file });
      }
      case "lightclient": {
        // let chain_spec = this.lightClientChainSpec();
        throw "todo!()";
        // return chain_spec && { tag: "lightclient", chain_spec };
      }
    }
  };

  // a signal that is true if the generate button is clickable.
  generateButtonClickable = (): boolean => {
    return this.loadingState() === "none" && !!this.clientCreationDataFromTab();
  };

  async generateAndUpdateAppConfig() {
    const creationData = this.clientCreationDataFromTab();
    if (creationData === undefined || this.#setSearchParams === undefined) {
      return;
    }
    AppConfig.instance.updateWith(creationData.tryIntoConfig());
    this.#setSearchParams!(AppConfig.instance.toParams());
    await this.#generate(creationData);
  }

  async #generate(data: ClientCreationData) {
    this.setError(undefined);
    console.log(
      "Kick off Generate Client for the current AppConfig:",
      AppConfig.instance
    );
    this.setLoadingState("loading");
    try {
      await createClient(data);
      AppConfig.instance.lastSuccessFullClientCreationConfig =
        data.tryIntoConfig();
      setSidebarVisibility("visible");
      this.maybeRedirect();
    } catch (ex: any) {
      this.setError(ex.toString());
      AppConfig.instance.lastSuccessFullClientCreationConfig = undefined;
    }
    this.setLoadingState("none");
  }

  // if the redirectPath is set, redirect to that path.
  maybeRedirect() {
    if (this.#redirectPath) {
      //  if redirect query param set, navigate to the correct page:
      const sidebarItem = findSideBarItemByPath(this.#redirectPath);
      if (sidebarItem === null) {
        this.setError(
          `Cannot redirect to ${this.#redirectPath}. It is not a valid page.`
        );
      } else {
        setActiveItem(sidebarItem!);
        const sanitizedRedirectPath = itemKindToPath(sidebarItem!.kind);
        const paramsString = AppConfig.instance.toParamsString();
        const completeRedirectPath = `${sanitizedRedirectPath}?${paramsString}`;
        console.log(
          "Home is done generating and redirects to",
          completeRedirectPath
        );
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
  async adjustUiToAppConfigInstance() {
    const creationConfig = AppConfig.instance.clientCreationConfig;
    if (
      creationConfig != undefined &&
      !ClientCreationConfig.equals(
        creationConfig,
        AppConfig.instance.lastSuccessFullClientCreationConfig
      )
    ) {
      this.#setSearchParams!(AppConfig.instance.toParams());
      const creationData = await creationConfig.intoClientCreationData();
      switch (creationConfig.deref.tag) {
        case "url":
          this.setUrl(creationConfig.deref.url);
          this.setTab("url");
          this.#generate(creationData);
          break;
        case "lightclient":
          this.setLightClientChainSpec(creationConfig.deref.chain_name);
          this.setTab("lightclient");
          this.#generate(creationData);
      }
    }
  }
}

export const HomePage: Component = () => {
  const state = HomePageState.instance;
  const setSearchParams = useSearchParams()[1];
  const navigate = useNavigate();
  state.infuseNavigationFns(setSearchParams, navigate);

  const [isDraggingOnUpload, setIsDraggingOnUpload] =
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
      description={`Drag Metadata (.scale) file here, or click "Upload"`}
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

  const lightClientFromFileTabContent = (
    <>
      <FileUploadArea
        isDragging={isDraggingOnUpload()}
        setDragging={setIsDraggingOnUpload}
        fileName={state.file()?.name}
        description={`Drag ChainSpec (.json) file here, or click "Upload"`}
        onDropOrUpload={async (files) => {
          if (files === undefined) {
            state.setError("Something went wrong with the file upload.");
          } else if (files.length !== 1) {
            state.setError("Please only select a single file.");
          } else {
            console.log("todo!()");
            // const filed_content = await files[0].text();
            // const chain_spec: ChainSpec = JSON.parse(
            //   filed_content
            // ) as ChainSpec;
            // state.setLightClientChainSpecFile(files[0]);
            // state.setError(undefined);
            // // directly generate new docs as soon as it it dragged in.
            // state.generateAndUpdateAppConfig();
          }
        }}
      ></FileUploadArea>
    </>
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
    {
      tab: {
        title: "Light Client",
        active: () => state.tab() == "lightclient",
        onClick: () => {
          state.setTab("lightclient");
          state.setError(undefined);
        },
        icon: "fa-bolt",
      },
      content: lightClientFromFileTabContent,
    },
  ];

  return (
    <>
      <button
        onClick={async () => {
          const chain_spec =
            await ChainSpecService.instance.loadChainSpecForChainName(
              "Polkadot"
            );
          console.log("chain_spec for polkadot", chain_spec);
        }}
      >
        fetch chainspecs
      </button>
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
