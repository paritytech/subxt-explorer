const SUBSTRATE_CONNECT_CHAIN_SPECS_GITHUB_URL =
  "https://api.github.com/repos/paritytech/substrate-connect/contents/packages/connect/src/connector/specs";

export type ChainSpec = {
  bootNodes: string[];
  name: string;
  id: string;
} & Record<string, unknown>;

export class ChainSpecService {
  static async fetchChainSpecs(): Promise<ChainSpec[]> {
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
    return specs;
  }
}
