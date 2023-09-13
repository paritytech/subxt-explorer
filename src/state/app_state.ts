import { createSignal } from "solid-js";
import { Client } from "subxt_example_codegen";
import {
  HOME_ITEM,
  SidebarItem,
  ItemKind,
  itemKindToPath,
  newItem,
} from "../models/sidebar";

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

export interface AppState {
  source: MetadataSource;
  client: Client;
  content: MetadataContent;
}

export async function fetchMetadataAndInitState(
  source: MetadataSource
): Promise<void> {
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

  let content = metadataContent(client);
  console.log(content);
  let items = buildSidebarItems(content);
  console.log(items);
  setSidebarItems(items);

  let state: AppState = {
    source,
    client,
    content,
  };
  setAppState(state);

  return;
}

async function readFileAsBytes(file: File): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const arrayBuffer = event?.target?.result;
      if (arrayBuffer instanceof ArrayBuffer) {
        res(new Uint8Array(arrayBuffer));
      } else {
        rej("event?.target?.result is not ArrayBuffer");
      }
    };

    fileReader.onerror = (event) => {
      // Reject the promise if there's an error
      rej(`some error occurred: ${event?.target?.error}`);
    };

    // Read the file as an ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  });
}

function metadataContent(client: Client): MetadataContent {
  return client.metadataContent() as MetadataContent;
}

function buildSidebarItems(metadataContent: MetadataContent): SidebarItem[] {
  let items: SidebarItem[] = [];
  // runtime apis
  if (metadataContent.runtime_apis.length != 0) {
    items.push(newItem({ tag: "runtime_apis" }));
  }
  // custom values
  if (metadataContent.custom_values.length != 0) {
    items.push(newItem({ tag: "custom_values" }));
  }
  // pallets
  let pallets = newItem({ tag: "pallets" });
  for (const pallet of metadataContent.pallets) {
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
    pallets.children.push(item);
  }
  items.push(pallets);

  return items;
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

// function pathT0

//     export function mapPath
