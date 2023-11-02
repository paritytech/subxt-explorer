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
    const url = params["url"];
    if (url) {
      return new ClientCreationConfig({
        tag: "url",
        url: decodeURI(url),
      });
    }
    return undefined;
  }

  intoParams(): Record<string, string> {
    const params: Record<string, string> = {};

    switch (this.#inner?.tag) {
      case "url":
        params["url"] = this.#inner.url;
        break;
      case "lightclient":
        params["lightclient"] = this.#inner.chain_name;
        break;
    }

    return params;
  }

  async intoClientCreationData(): Promise<ClientCreationData> {
    switch (this.#inner?.tag) {
      case "url":
        return new ClientCreationData({ tag: "url", url: this.#inner.url });
      case "lightclient": {
        const chain_spec =
          await ChainSpecService.instance.loadChainSpecForChainName(
            this.#inner.chain_name
          );
        return new ClientCreationData({
          tag: "lightclient",
          is_preset: true,
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

type OnlineClientCreationConfig = {
  tag: "url";
  url: string;
};

type LightClientCreationConfig = {
  tag: "lightclient";
  chain_name: string;
};
