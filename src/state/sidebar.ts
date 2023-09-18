import { createSignal } from "solid-js";

export const [sidebarItems, setSidebarItems] = createSignal<SidebarItem[]>([]);

export const HOME_ITEM: SidebarItem = newItem({ tag: "home" });
export const [activeItem, setActiveItem] = createSignal<SidebarItem>(HOME_ITEM);

export function findInSidebarItems(
  fn: (item: SidebarItem) => boolean
): SidebarItem | undefined {
  return recursiveFind(sidebarItems(), fn);
}

function recursiveFind(
  arr: SidebarItem[],
  fn: (item: SidebarItem) => boolean
): SidebarItem | undefined {
  for (const e of arr) {
    if (fn(e)) {
      return e;
    }
    let childFound = recursiveFind(e.children, fn);
    if (childFound !== undefined) {
      return childFound;
    }
  }
  return undefined;
}

export function newItem(kind: ItemKind): SidebarItem {
  return {
    kind,
    path: itemKindToPath(kind),
    title: itemKindToTitle(kind),
    children: [],
  };
}

export interface SidebarItem {
  // title: string;
  // prefix: string | undefined;
  kind: ItemKind;
  next?: SidebarItem;
  prev?: SidebarItem;
  path: string;
  title: string;
  children: SidebarItem[];
}

export type ItemKind =
  | { tag: "home" }
  | { tag: "runtime_apis" }
  | { tag: "runtime_api"; runtime_api: string }
  | { tag: "custom_values" }
  | {
      tag: "pallet";
      pallet: string;
      index: number;
    }
  | {
      tag: "calls";
      pallet: string;
    }
  | {
      tag: "storage_entries";
      pallet: string;
    }
  | {
      tag: "constants";
      pallet: string;
    };

// Note currently not necessary

// export function pathToItemKind(path: string): ItemKind | undefined {
//   let segs = path.split("/").filter((e) => e.length > 0);
//   if (segs.length == 0) {
//     return HOME_ITEM;
//   }
//   switch (segs[0]!) {
//     case "runtime_apis":
//       if (segs[1]) {
//         return { tag: "runtime_api", runtime_api: segs[1] };
//       } else {
//         return { tag: "runtime_apis" };
//       }
//     case "custom_values":
//       return { tag: "custom_values" };
//     case "pallets":
//       if (segs[1]) {
//         switch (segs[2]) {
//           case "calls":
//             return { tag: "calls", pallet: segs[1] };
//           case "storage_entries":
//             return { tag: "storage_entries", pallet: segs[1] };
//           case "constants":
//             return { tag: "constants", pallet: segs[1] };
//           default:
//             return { tag: "pallet", pallet: segs[1], index: -1 };
//         }
//       } else {
//         return HOME_ITEM;
//       }
//     default:
//       return HOME_ITEM;
//   }
// }

export function itemKindToPath(item: ItemKind): string {
  switch (item.tag) {
    case "home":
      return "/";
    case "runtime_apis":
      return "/runtime_apis";
    case "runtime_api":
      return `/runtime_apis/${item.runtime_api}`;
    case "custom_values":
      return "/custom_values";
    case "pallet":
      return `/pallets/${item.pallet}`;
    case "calls":
      return `/pallets/${item.pallet}/calls`;
    case "storage_entries":
      return `/pallets/${item.pallet}/storage_entries`;
    case "constants":
      return `/pallets/${item.pallet}/constants`;
  }
}

export function itemKindToTitle(item: ItemKind): string {
  switch (item.tag) {
    case "home":
      return "Home";
    case "runtime_apis":
      return "Runtime APIs";
    case "runtime_api":
      return item.runtime_api;
    case "custom_values":
      return "Custom Value";
    case "pallet":
      return `${item.pallet}`;
    case "calls":
      return "Calls";
    case "storage_entries":
      return "Storage Entries";
    case "constants":
      return "Constants";
  }
}
