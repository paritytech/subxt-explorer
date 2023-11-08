import { ChainSpec } from "../../services/chain_spec_service";
import { ClientCreationConfig } from "./client_creation_config";

export class ClientCreationData {
  #inner: TClientCreationData;

  get deref(): TClientCreationData {
    return this.#inner;
  }

  constructor(inner: TClientCreationData) {
    this.#inner = inner;
  }

  tryIntoConfig(): ClientCreationConfig | undefined {
    switch (this.#inner.tag) {
      case "url":
        return new ClientCreationConfig({
          tag: "url",
          url: this.#inner.url,
        });
      case "file":
        // cannot make a file into a config, because configs need to be sharaeble via query params.
        return undefined;
      case "lightclient":
        // can only make a lightclient into a config if it is a preset (fetchable from github).
        if (this.#inner.chain_spec instanceof File) {
          return undefined;
        } else {
          return new ClientCreationConfig({
            tag: "lightclient",
            chain_name: this.#inner.chain_spec.name,
          });
        }
    }
  }
}

export type ClientCreationDataTag = TClientCreationData["tag"];

type TClientCreationData =
  | OnlineClientCreationData
  | OfflineClientCreationData
  | LightClientCreationData;

export type OnlineClientCreationData = {
  tag: "url";
  url: string;
};

export type OfflineClientCreationData = {
  tag: "file";
  file: File;
};

export type LightClientCreationData = {
  tag: "lightclient";
  chain_spec: ChainSpec | File;
};
