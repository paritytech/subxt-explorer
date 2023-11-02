import { Accessor, Setter, createSignal } from "solid-js";
import { SUBSTRATE_CONNECT_CHAIN_SPECS_GITHUB_URL } from "../constants";

export type ChainSpec = {
  bootNodes: string[];
  name: string;
  id: string;
} & Record<string, unknown>;

export type ChainSpecsFetchingState =
  | { tag: "success"; specs: ChainSpec[] }
  | { tag: "loading" }
  | { tag: "error"; error: string };

export class ChainSpecService {
  chainSpecs: Accessor<ChainSpecsFetchingState>;
  #setChainSpecs: Setter<ChainSpecsFetchingState>;

  static #instance: ChainSpecService;
  static get instance(): ChainSpecService {
    if (ChainSpecService.#instance === undefined) {
      ChainSpecService.#instance = new ChainSpecService();
    }
    return ChainSpecService.#instance;
  }

  constructor() {
    const [chainSpecs, setChainSpecs] = createSignal<ChainSpecsFetchingState>({
      tag: "loading",
    });
    this.chainSpecs = chainSpecs;
    this.#setChainSpecs = setChainSpecs;
  }

  async fetchAndCacheChainSpecs(): Promise<void> {
    console.log("ChainSpecService: start fetching chain specs...");
    this.#setChainSpecs({ tag: "loading" });
    try {
      const res = await fetch(SUBSTRATE_CONNECT_CHAIN_SPECS_GITHUB_URL);
      const json: any = await res.json();

      const specs: ChainSpec[] = [];
      for (const fileEntry of json) {
        if (!fileEntry.name.endsWith(".json")) {
          continue;
        }
        const res = await fetch(fileEntry.download_url);
        const spec: unknown = await res.json();
        specs.push(spec as ChainSpec);
      }

      console.log("ChainSpecService: fetching successful!", specs);
      this.#handleOnLoadCallbacks(specs);
      this.#setChainSpecs({ tag: "success", specs });
    } catch (ex: any) {
      console.error("ChainSpecService: fetching error!", ex);
      this.#setChainSpecs({
        tag: "error",
        error: ex.toString(),
      });
    }
  }

  #on_load_call_backs: ChainSpecResolver[] = [];
  #handleOnLoadCallbacks(specs: ChainSpec[]) {
    for (const [chain_name, resolve, reject] of this.#on_load_call_backs) {
      const spec = specs.find((spec) => spec.name === chain_name);
      if (spec) {
        resolve(spec);
      } else {
        reject(
          new Error(
            `Chain spec with name ${chain_name} not found in loaded presets`
          )
        );
      }
    }
    this.#on_load_call_backs = [];
  }

  loadChainSpecForChainName(chain_name: string): Promise<ChainSpec> {
    const chainSpecs = this.chainSpecs();
    switch (chainSpecs.tag) {
      case "success": {
        const spec = chainSpecs.specs.find((spec) => spec.name === chain_name);
        if (spec) {
          return Promise.resolve(spec);
        } else {
          return Promise.reject(
            new Error(
              `Chain spec with name ${chain_name} not found in loaded presets`
            )
          );
        }
      }
      case "loading": {
        return new Promise((resolve, reject) => {
          this.#on_load_call_backs.push([chain_name, resolve, reject]);
        });
      }
      case "error":
        return Promise.reject(new Error(chainSpecs.error));
    }
  }
}

type ChainSpecResolver = [
  string,
  (value: ChainSpec | PromiseLike<ChainSpec>) => void,
  (reason?: any) => void
];
