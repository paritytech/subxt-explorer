import { ChainSpecService } from "../../services/chain_spec_service";
import { ClientCreationData } from "./client_creation_data";

export class ClientCreationConfig {
  #inner: TClientCreationConfig;

  get deref(): TClientCreationConfig {
    return this.#inner;
  }

  constructor(inner: TClientCreationConfig) {
    this.#inner = inner;
  }

  static tryFromParams(
    params: Record<string, string>
  ): ClientCreationConfig | undefined {
    const config = params["config"];
    if (config == undefined) {
      return undefined;
    }

    const d = ClientCreationConfig.tryDecodeFromString(config);

    console.log("d", d);
    return d;
  }

  static tryDecodeFromString(string: string): ClientCreationConfig | undefined {
    if (string.length < 4) {
      return undefined;
    }
    const tag = string.substring(0, 3);
    const data = string.substring(4);
    console.log("tag", tag);
    console.log("data", data);
    switch (tag) {
      case "url":
        return new ClientCreationConfig({
          tag: "url",
          url: data,
        });
      case "lcl": {
        return new ClientCreationConfig({
          tag: "lightclient",
          chain_name: data,
        });
      }
    }
  }

  encodeToString(): string {
    let tag: string;
    let data: string;

    switch (this.#inner.tag) {
      case "url": {
        tag = "url";
        data = this.#inner.url;
        break;
      }
      case "lightclient": {
        tag = "lcl";
        data = this.#inner.chain_name;
        break;
      }
    }

    return `${tag}_${data}`;
  }

  async intoClientCreationData(): Promise<ClientCreationData> {
    switch (this.#inner?.tag) {
      case "url":
        return new ClientCreationData({ tag: "url", url: this.#inner.url });
      case "lightclient": {
        const chain_spec =
          await ChainSpecService.instance.fetchChainSpecForChainName(
            this.#inner.chain_name
          );
        if (chain_spec == undefined) {
          throw `Could not load chain spec for chain ${this.#inner.chain_name}`;
        }
        return new ClientCreationData({
          tag: "lightclient",
          chain_spec,
        });
      }
    }
  }

  equals(other: ClientCreationConfig | undefined): boolean {
    return ClientCreationConfig.equals(this, other);
  }

  static equals(
    a: ClientCreationConfig | undefined,
    b: ClientCreationConfig | undefined
  ): boolean {
    if (a === b) {
      return true;
    }

    if (a === undefined || b === undefined) {
      return false;
    }

    if (a.#inner.tag !== b.#inner.tag) {
      return false;
    }

    switch (a.#inner.tag) {
      case "url":
        return a.#inner.url === (b.#inner as OnlineClientCreationConfig).url;
      case "lightclient":
        return (
          a.#inner.chain_name ===
          (b.#inner as LightClientCreationConfig).chain_name
        );
    }
  }
}

export type TClientCreationConfig =
  | OnlineClientCreationConfig
  | LightClientCreationConfig;

export type OnlineClientCreationConfig = {
  tag: "url";
  url: string;
};

export type LightClientCreationConfig = {
  tag: "lightclient";
  chain_name: string;
};
