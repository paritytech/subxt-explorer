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
  pages: {
    hierarchy: HierarchyItem[];
    active: HierarchyItem;
  };
  content: MetadataContent;
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
  let hierarchy = buildHierarchyItems(content);

  console.log(content);

  return {
    source,
    client,
    pages: {
      hierarchy,
      active: hierarchy[0],
    },
    content,
  };
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

function buildHierarchyItems(
  metadataContent: MetadataContent
): HierarchyItem[] {
  throw "todo";
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

const START_ITEM: HierarchyItemKind = { tag: "start" };

function pathToHierarchyItemKind(path: string): HierarchyItemKind | undefined {
  let segs = path.split("/").filter((e) => e.length > 0);
  if (segs.length == 0) {
    return START_ITEM;
  }
  switch (segs[0]!) {
    case "pallets":
      return START_ITEM;

    default:
      return START_ITEM;
  }
}

function hierarchyItemKindToPath(item: HierarchyItemKind): string {
  switch (item.tag) {
    case "start":
      return "/";
    case "runtime_apis":
      return "/runtime_apis";
    case "runtime_api":
      return `/runtime_apis/${item.name}`;
    case "custom_values":
      return "/custom_values";
    case "custom_value":
      return `/custom_values/${item.name}`;
    case "pallets":
      return "/pallets";
    case "pallet":
      return `/pallet/${item.name}`;
    case "calls":
      return `/pallet/${item.pallet}/calls`;
    case "call":
      return `/pallet/${item.pallet}/calls/${item.name}`;
    case "storage_entries":
      return `/pallet/${item.pallet}/storage_entries`;
    case "storage_entry":
      return `/pallet/${item.pallet}/storage_entries/${item.name}`;
    case "constants":
      return `/pallet/${item.pallet}/constants`;
    case "constant":
      return `/pallet/${item.pallet}/constants/${item.name}`;
  }
}

// function pathT0

//     export function mapPath
