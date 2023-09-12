import { createSignal } from "solid-js";
import { Client } from "subxt_example_codegen";

export type MetadataSource =
  | {
      tag: "url";
      url: string;
    }
  | {
      tag: "file";
      file: File;
    };

export interface AppState {
  source: MetadataSource;
  client: Client;
  sidebar: {
    hierarchy: PagesHierarchy;
    activeItem: HierarchyItem;
  };
}

export async function buildAppData(source: MetadataSource): Promise<AppState> {
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

  const data = {
    client,
    source,
  };

  console.log("done building app data:", data);

  throw "todo";
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

export const [appData, setAppData] = createSignal<AppState | undefined>(
  undefined
);

function metadataContent(client: Client): MetadataContent {
  return client.metadataContent() as MetadataContent;
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

export interface PagesHierarchy {
  items: HierarchyItem[];
}

export interface HierarchyItem {
  // title: string;
  // prefix: string | undefined;
  kind: HierarchyItemKind;
  next: HierarchyItem | undefined;
  prev: HierarchyItem | undefined;
  children: HierarchyItem[];
}

type HierarchyItemKind =
  | { tag: "start" }
  | { tag: "contents" }
  | { tag: "runtime_apis" }
  | { tag: "runtime_api"; name: string }
  | { tag: "custom_values" }
  | {
      tag: "custom_value";
      name: string;
    }
  | {
      tag: "pallets";
    }
  | {
      tag: "pallet";
      name: string;
    }
  | {
      tag: "calls";
      pallet: string;
    }
  | {
      tag: "call";
      pallet: string;
      name: string;
    }
  | {
      tag: "storage_entries";
      pallet: string;
    }
  | {
      tag: "storage_entry";
      pallet: string;
      name: string;
    }
  | {
      tag: "constants";
      pallet: string;
    }
  | {
      tag: "constant";
      pallet: string;
      name: string;
    };
