import { createSignal } from "solid-js";
import { Client } from "subxt_example_codegen";
import {
  HOME_ITEM,
  SidebarItem,
  ItemKind,
  itemKindToPath,
  newItem,
  setSidebarItems,
} from "./sidebar_state";
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
      let item = newItem({ tag: "runtime_apis" });
      for (const runtimeAPI of this.content.runtime_apis) {
        item.children.push(
          newItem({ tag: "runtime_api", runtime_api: runtimeAPI.name })
        );
      }
      items.push(item);
    }
    // custom values
    if (this.content.custom_values.length != 0) {
      items.push(newItem({ tag: "custom_values" }));
    }
    // pallets
    for (const pallet of this.content.pallets) {
      let item = newItem({
        tag: "pallet",
        pallet: pallet.name,
        index: pallet.index,
      });
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
      if (pallet.events.length != 0) {
        item.children.push(newItem({ tag: "events", pallet: pallet.name }));
      }
      items.push(item);
    }
    // go over items to set next and prev items (for navigation):
    let flattened: SidebarItem[] = [];
    function add_to_flattened(item: SidebarItem) {
      flattened.push(item);
      for (const child of item.children) {
        add_to_flattened(child);
      }
    }
    for (const item of items) {
      add_to_flattened(item);
    }
    for (let i = 0; i < flattened.length; i++) {
      const item = flattened[i];
      // Note: I think bounds checks are not necessary in JS, so i omit them.
      item.prev = flattened[i - 1];
      item.next = flattened[i + 1];
    }
    return items;
  }

  palletDocs(palletName: string): string[] | undefined {
    return this.client.palletDocs(palletName) as string[] | undefined;
  }

  palletContent(palletName: string): PalletContent | undefined {
    return this.client.palletContent(palletName) as PalletContent | undefined;
  }

  runtimeApiTraitContent(
    palletName: string
  ): RuntimeAPITraitContent | undefined {
    return this.client.runtimeApiTraitContent(palletName) as
      | RuntimeAPITraitContent
      | undefined;
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
        console.error("Error: undefined call content for call", callName);
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
      if (content !== undefined) {
        items.push(content);
      } else {
        console.error("Error: undefined content for storage entry", entryName);
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
      if (content !== undefined) {
        items.push(content);
      } else {
        console.error("Error: undefined content for storage entry", entryName);
      }
    }

    return items;
  }

  palletEvents(palletName: string): EventContent[] | undefined {
    const pallet = this.palletContent(palletName);
    if (pallet === undefined) {
      return undefined;
    }

    const items: EventContent[] = [];

    for (const eventName of pallet.events) {
      let content = this.client.eventContent(palletName, eventName) as
        | EventContent
        | undefined;
      if (content !== undefined) {
        items.push(content);
      } else {
        console.error("Error: undefined call content for event", eventName);
      }
    }

    return items;
  }

  runtimeApiDocs(runtimeApiTraitName: string): string[] | undefined {
    return this.client.runtimeApiTraitDocs(runtimeApiTraitName) as
      | string[]
      | undefined;
  }

  runtimeApiMethods(
    runtimeApiTraitName: string
  ): RuntimeApiMethodContent[] | undefined {
    let runtimeApi = this.runtimeApiTraitContent(runtimeApiTraitName);
    if (runtimeApi === undefined) {
      return undefined;
    }
    let methodContents: RuntimeApiMethodContent[] = [];

    for (const methodName of runtimeApi.methods) {
      let content = this.client.runtimeApiMethodContent(
        runtimeApiTraitName,
        methodName
      ) as RuntimeApiMethodContent | undefined;
      if (content !== undefined) {
        methodContents.push(content);
      } else {
        console.error(
          "Error: undefined content for runtime api method",
          runtimeApiTraitName,
          methodName
        );
      }
    }
    return methodContents;
  }

  /**
   * Returns the scale value string of a storage entry
   * @param palletName
   * @param storageEntryName
   */
  async fetchKeylessStorageValue(
    palletName: string,
    storageEntryName: string
  ): Promise<string | undefined> {
    let valueString = await this.client.fetchKeylessStorageValue(
      palletName,
      storageEntryName
    );
    return valueString as string | undefined;
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
  runtime_apis: RuntimeAPITraitContent[];
  custom_values: string[];
}

export interface PalletContent {
  index: number;
  name: string;
  calls: string[];
  storage_entries: string[];
  constants: string[];
  events: string[];
}

export interface RuntimeAPITraitContent {
  name: string;
  methods: string[];
}

export type CallContent = {
  argument_types: NameAndType[];
} & PalletItemConent;

export type EventContent = {
  field_types: NameAndType[];
} & PalletItemConent;

export type StorageEntryContent = {
  value_type: TypeDescription; // type path
  key_types: TypeDescription[]; // type paths
} & PalletItemConent;

export type ConstantContent = {
  value_type: TypeDescription; // type path
  value: string;
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

export interface RuntimeApiMethodContent {
  runtime_api_trait_name: string;
  method_name: string;
  docs: string[];
  code_example_static: string;
  code_example_dynamic: string;
  input_types: NameAndType[];
  value_type: TypeDescription;
}

export interface NameAndType {
  name: string; // type name
  type_description: TypeDescription; // type path
}

export interface TypeDescription {
  // e.g. runtime_types::sp_runtime::transaction_validity::TransactionSource
  type_path: string;
  // e.g. TransactionSource { hello: String, num: u8 }
  type_structure: string;
}
