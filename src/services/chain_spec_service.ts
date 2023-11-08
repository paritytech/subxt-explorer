import { SUBSTRATE_CONNECT_CHAIN_SPECS_GITHUB_URL } from "../constants";

export type ChainSpec = {
  bootNodes: string[];
  name: string;
  id: string;
} & Record<string, unknown>;

export class ChainSpecService {
  static #instance: ChainSpecService;
  static get instance(): ChainSpecService {
    if (ChainSpecService.#instance === undefined) {
      ChainSpecService.#instance = new ChainSpecService();
    }
    return ChainSpecService.#instance;
  }

  constructor() {}

  async fetchChainSpecs(): Promise<ChainSpec[]> {
    let loading: Promise<ChainSpec[]> | undefined = undefined;

    if (!loading) {
      loading = fetchChainSpecs().catch((e) => {
        loading = undefined;
        throw e;
      });
    }
    return loading;
  }

  async fetchChainSpecForChainName(
    chain_name: string
  ): Promise<ChainSpec | undefined> {
    const specs = await fetchChainSpecs();
    const spec = specs.find((spec) => spec.name === chain_name);
    return spec;
  }
}

async function fetchChainSpecs(): Promise<ChainSpec[]> {
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
  return specs;
}
