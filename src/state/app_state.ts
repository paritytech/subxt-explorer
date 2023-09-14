import { createSignal } from "solid-js";
import { Client } from "subxt_example_codegen";
import {
  HOME_ITEM,
  SidebarItem,
  ItemKind,
  itemKindToPath,
  newItem,
} from "../models/sidebar";
import { readFileAsBytes } from "../utils";

export type MetadataSource =
  | {
      tag: "url";
      url: string;
    }
  | {
      tag: "file";
      file: File;
    };

export const [sidebarItems, setSidebarItems] = createSignal<SidebarItem[]>([]);

export const [appState, setAppState] = createSignal<AppState | undefined>(
  undefined
);

export class AppState {
  source: MetadataSource;
  client: Client;
  content: MetadataContent;

  constructor(source: MetadataSource, client: Client) {
    this.source = source;
    this.client = client;
    this.content = client.metadataContent() as MetadataContent;
  }

  static async fetchFromSource(source: MetadataSource): Promise<AppState> {
    let client: Client;
    switch (source.tag) {
      case "url":
        client = await Client.fromUrl(source.url);
        break;
      case "file":
        let bytes = await readFileAsBytes(source.file);
        client = Client.fromBytes(source.file.name, bytes);
        break;
    }
    return new AppState(source, client);
  }

  constructSidebarItems(): SidebarItem[] {
    let items: SidebarItem[] = [];
    // runtime apis
    if (this.content.runtime_apis.length != 0) {
      items.push(newItem({ tag: "runtime_apis" }));
    }
    // custom values
    if (this.content.custom_values.length != 0) {
      items.push(newItem({ tag: "custom_values" }));
    }
    // pallets
    for (const pallet of this.content.pallets) {
      let item = newItem({ tag: "pallet", pallet: pallet.name });
      if (pallet.calls.length != 0) {
        item.children.push(newItem({ tag: "calls", pallet: pallet.name }));
      }
      if (pallet.storage_entries.length != 0) {
        item.children.push(
          newItem({ tag: "storage_entries", pallet: pallet.name })
        );
      }
      if (pallet.constants.length != 0) {
        item.children.push(newItem({ tag: "constants", pallet: pallet.name }));
      }
      items.push(item);
    }
    return items;
  }

  palletDocs(palletName: string): string[] | undefined {
    return this.client.palletDocs(palletName) as string[] | undefined;
  }

  palletContent(palletName: string): PalletContent | undefined {
    return this.client.palletContent(palletName) as PalletContent | undefined;
  }

  palletCalls(palletName: string): CallContent[] | undefined {
    const pallet = this.palletContent(palletName);
    if (pallet === undefined) {
      return undefined;
    }

    const items: CallContent[] = [];

    for (const callName of pallet.calls) {
      let content = this.client.callContent(palletName, callName) as
        | CallContent
        | undefined;
      if (content !== undefined) {
        items.push(content);
      } else {
        console.log("Error: undefined call content for call", callName);
      }
    }

    return items;
  }

  palletStorageEntries(palletName: string): StorageEntryContent[] | undefined {
    const pallet = this.palletContent(palletName);
    if (pallet === undefined) {
      return undefined;
    }

    const items: StorageEntryContent[] = [];

    for (const entryName of pallet.storage_entries) {
      let content = this.client.storageEntryContent(palletName, entryName) as
        | StorageEntryContent
        | undefined;
      console.log(content);
      if (content !== undefined) {
        items.push(content);
      } else {
        console.log("Error: undefined content for storage entry", entryName);
      }
    }

    return items;
  }

  palletConstants(palletName: string): ConstantContent[] | undefined {
    const pallet = this.palletContent(palletName);
    if (pallet === undefined) {
      return undefined;
    }

    const items: ConstantContent[] = [];

    for (const entryName of pallet.constants) {
      let content = this.client.constantContent(palletName, entryName) as
        | ConstantContent
        | undefined;
      console.log(content);
      if (content !== undefined) {
        items.push(content);
      } else {
        console.log("Error: undefined content for storage entry", entryName);
      }
    }

    return items;
  }
}

// export interface AppState {
//   source: MetadataSource;
//   client: Client;
//   content: MetadataContent;
// }

export async function fetchMetadataAndInitState(
  source: MetadataSource
): Promise<void> {
  setAppState(undefined);
  setSidebarItems([]);
  let state = await AppState.fetchFromSource(source);
  let items = state.constructSidebarItems();
  setSidebarItems(items);
  setAppState(state);
}

export interface MetadataContent {
  pallets: PalletContent[];
  runtime_apis: string[];
  custom_values: string[];
}

export interface PalletContent {
  name: string;
  calls: string[];
  storage_entries: string[];
  constants: string[];
}

export type CallContent = {} & PalletItemConent;

export type StorageEntryContent = {
  value_type: string;
  key_types: string[];
} & PalletItemConent;

export type ConstantContent = {
  value_type: string;
  value?: string;
} & PalletItemConent;

/**
 * A common denominator between call, storage entry and constant.
 */
export interface PalletItemConent {
  pallet_name: string;
  name: string;
  docs: string[];
  code_example_static: string;
  code_example_dynamic: string;
}
