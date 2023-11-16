import { Accessor, Component, JSX, Setter, Show, createSignal } from "solid-js";
import { DEFAULT_HOME_PAGE_TAB, DEFAULT_WS_URL } from "../constants";
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
import { ChainSpec } from "../services/chain_spec_service";
import {
  ClientCreationData,
  ClientCreationDataTag,
} from "../state/models/client_creation_data";
import {
  ClientCreationConfig,
  LightClientCreationConfig,
  OnlineClientCreationConfig,
} from "../state/models/client_creation_config";
import { ChainSpecPresetSelection } from "../components/ChainSpecPresetSelection";

/**
 * The loading state of the home page. We distinguish between loading on the first page load and loading after the generate button was clicked.
 * "ui-interaction-load": Just show a spinner on the generate button.
 * "page-load": Show a big spinner instead of the general ui.
 */
type LoadingState = "ui-interaction-load" | "page-load" | undefined;

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
  lightClientChainSpec: Accessor<File | ChainSpec | undefined>;
  setLightClientChainSpec: Setter<File | ChainSpec | undefined>;
  selectedLightClientPresetChainName: Accessor<string | undefined>;
  setSelectedLightClientPresetChainName: Setter<string | undefined>;
  loading: Accessor<LoadingState>;
  setLoading: Setter<LoadingState>;

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
    const [tab, setTab] = createSignal<ClientCreationDataTag>(
      DEFAULT_HOME_PAGE_TAB
    );
    this.tab = tab;
    this.setTab = setTab;
    const [url, setUrl] = createSignal<string>(DEFAULT_WS_URL);
    this.url = url;
    this.setUrl = setUrl;
    const [lightClientChainSpec, setLightClientChainSpec] = createSignal<
      File | ChainSpec | undefined
    >(undefined);
    this.lightClientChainSpec = lightClientChainSpec;
    this.setLightClientChainSpec = setLightClientChainSpec;
    const [loading, setLoading] = createSignal<LoadingState>(undefined);
    this.loading = loading;
    this.setLoading = setLoading;

    const [
      selectedLightClientPresetChainName,
      setSelectedLightClientPresetChainName,
    ] = createSignal<string | undefined>(undefined);
    this.selectedLightClientPresetChainName =
      selectedLightClientPresetChainName;
    this.setSelectedLightClientPresetChainName =
      setSelectedLightClientPresetChainName;
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
    return this.loading() !== undefined;
  }

  // takes the state of the ui elements and translates that into `ClientCreationData` that can be used to create a client.
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
        const spec = this.lightClientChainSpec();
        if (spec === undefined) {
          return undefined;
        }
        return new ClientCreationData({
          tag: "lightclient",
          chain_spec: spec,
        });
      }
    }
  };

  /**
   * Called from UI events, like the generate button click.
   */
  async generateAndUpdateAppConfig() {
    const creationData = this.clientCreationDataFromTab();
    console.log(creationData);
    if (creationData === undefined || this.#setSearchParams === undefined) {
      return;
    }
    AppConfig.instance.updateWith(creationData.tryIntoConfig());
    this.#setSearchParams!(AppConfig.instance.toParams());
    await this.#generate(creationData, "ui-interaction-load");
  }

  async #generate(data: ClientCreationData, withLoadingState: LoadingState) {
    this.setError(undefined);
    console.log(
      "Kick off Generate Client for the current AppConfig:",
      AppConfig.instance
    );
    this.setLoading(withLoadingState);
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
    this.setLoading(undefined);
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
  async reconfigureUiForNewAppConfig() {
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
      console.log(creationData);
      switch (creationData.deref.tag) {
        case "url":
          this.setUrl(creationData.deref.url);
          this.setTab("url");
          this.#generate(creationData, "page-load");
          break;
        case "lightclient":
          this.setSelectedLightClientPresetChainName(
            creationData.deref.chain_spec.name
          );
          this.setLightClientChainSpec(creationData.deref.chain_spec);
          this.setTab("lightclient");
          this.#generate(creationData, "page-load");
      }
    }
  }
}

export const HomePage: Component = () => {
  const state = HomePageState.instance;
  const setSearchParams = useSearchParams()[1];
  const navigate = useNavigate();
  state.infuseNavigationFns(setSearchParams, navigate);
  state.reconfigureUiForNewAppConfig();

  // a signal that is true if the generate button is clickable.
  const generateButtonClickable = (): boolean => {
    return (
      !HomePageState.instance.is_loading &&
      !!HomePageState.instance.clientCreationDataFromTab()
    );
  };

  const UrlTabContent = () => (
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

  const FileTabContent = () => (
    <FileUploadArea
      fileName={state.file()?.name}
      description={`Drag metadata file (.scale) here, or click "Upload"`}
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
    />
  );

  const LightClientTabContent = () => (
    <>
      <FileUploadArea
        fileName={
          state.lightClientChainSpec() instanceof File
            ? state.lightClientChainSpec()?.name
            : undefined
        }
        description={`Drag chain spec file (.json) here, or click "Upload"`}
        onDropOrUpload={async (files) => {
          if (files === undefined) {
            state.setError("Something went wrong with the file upload.");
          } else if (files.length !== 1) {
            state.setError("Please only select a single file.");
          } else {
            state.setLightClientChainSpec(files[0]);
            state.setError(undefined);
            // directly generate try to connect to light client when some file gets dragged in.
            state.generateAndUpdateAppConfig();
          }
        }}
      />
      <div class="my-6">Or select a chain spec from the presets:</div>
      <ChainSpecPresetSelection
        selectedSpecName={state.selectedLightClientPresetChainName}
        onChainSpecPresetSelected={(chainSpec) => {
          state.setSelectedLightClientPresetChainName(chainSpec.name);
          state.setLightClientChainSpec(chainSpec);
          state.setError(undefined);
        }}
      ></ChainSpecPresetSelection>
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
      component: UrlTabContent,
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
      component: FileTabContent,
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
      component: LightClientTabContent,
    },
  ];

  return (
    <>
      <h1>Subxt Explorer</h1>
      Ever wondered how to interact with a custom substrate node using Subxt?
      Upload a scale encoded metadata file or input a substrate node url to get
      started:
      <div></div>
      <Show
        when={HomePageState.instance.loading() != "page-load"} //
      >
        <TabLayout
          tabs={tabsWithContent}
          tabsContainerClass="mt-5"
          contentContainerClass="py-5 my-5"
        ></TabLayout>
        {state.error() && (
          <div class="text-center w-full text-red-400 mb-4">
            {state.error()}
          </div>
        )}
      </Show>
      <Show
        when={!HomePageState.instance.loading()}
        fallback={<BigLoadingIndicator></BigLoadingIndicator>}
      >
        <div>
          <button
            class={`btn ${generateButtonClickable() ? "" : "disabled"}`}
            disabled={!generateButtonClickable()}
            onClick={() => {
              state.generateAndUpdateAppConfig();
            }}
          >
            <span class="fa fa-play mr-4"></span>
            Generate Docs
          </button>
        </div>
      </Show>
      <SubxtExplanationSection />
    </>
  );
};

function SubxtExplanationSection(): JSX.Element {
  return (
    <div>
      <h2 class="mt-20">Subxt - Interact with Substrate-based Blockchains</h2>
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

function BigLoadingIndicator(): JSX.Element {
  let loadingText: JSX.Element = `Loading...`;

  const config = AppConfig.instance.clientCreationConfigSignal;
  if (config() !== undefined) {
    switch (config()!.deref.tag) {
      case "lightclient":
        loadingText = (
          <>
            Connecting to the{" "}
            <strong class="text-pink-500">
              {(config()!.deref as LightClientCreationConfig).chain_name}
            </strong>{" "}
            chain via <strong class="text-pink-500">Light Client</strong>...
            <br />
            <div class="mt-4 text-gray-500">
              This might take up to 30 seconds...
            </div>
          </>
        );
        break;
      case "url":
        loadingText = (
          <>
            Connecting to{" "}
            <strong class="text-pink-500">
              {(config()!.deref as OnlineClientCreationConfig).url}
            </strong>{" "}
            via RPC...
          </>
        );
        break;
    }
  }

  return (
    <div class="text-center mt-12">
      <div style={{ "font-size": "100px" }}>
        <span
          class="fa fa-spinner mr-3 w-2 h-8 animate-spin text-pink-500"
          style={{
            width: "100px",
            height: "100px",
          }}
        ></span>
      </div>
      <div class="mt-6">{loadingText}</div>
    </div>
  );
}
