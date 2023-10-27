import { Signal, createEffect, createSignal } from "solid-js";

export const [sidebarItems, setSidebarItems] = createSignal<SidebarItem[]>([]);

export const HOME_ITEM: SidebarItem = newItem({ tag: "home" });
export const [activeItem, setActiveItem] = createSignal<SidebarItem>(HOME_ITEM);

export function findSideBarItemByPath(path: string): SidebarItem | null {
  let itemKind = pathToItemKind(path);
  if (itemKind === undefined) {
    return null;
  }
  return findInSidebarItems((item) => itemKindEquals(item.kind, itemKind!));
}

export function findInSidebarItems(
  fn: (item: SidebarItem) => boolean
): SidebarItem | null {
  return recursiveFind(sidebarItems(), fn);
}

function recursiveFind(
  arr: SidebarItem[],
  fn: (item: SidebarItem) => boolean
): SidebarItem | null {
  for (const e of arr) {
    if (fn(e)) {
      return e;
    }
    let childFound = recursiveFind(e.children, fn);
    if (childFound !== null) {
      return childFound;
    }
  }
  return null;
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
    }
  | {
      tag: "events";
      pallet: string;
    };

function itemKindEquals(a: ItemKind, b: ItemKind): boolean {
  if (a.tag !== b.tag) {
    return false;
  }
  switch (a.tag) {
    case "home":
    case "custom_values":
    case "runtime_apis":
      return true;
    case "runtime_api":
      return a.runtime_api === (b as any).runtime_api;
    case "pallet":
    case "calls":
    case "storage_entries":
    case "constants":
    case "events":
      return a.pallet === (b as any).pallet;
    default:
      throw new Error("illegal itemKind for sidebar item");
  }
}

// Note: currently not necessary

export function pathToItemKind(path: string): ItemKind | undefined {
  let segs = path.split("/").filter((e) => e.length > 0);
  if (segs.length == 0) {
    return { tag: "home" };
  }
  switch (segs[0]!) {
    case "runtime_apis":
      if (segs[1]) {
        return { tag: "runtime_api", runtime_api: segs[1] };
      } else {
        return { tag: "runtime_apis" };
      }
    case "custom_values":
      return { tag: "custom_values" };
    case "pallets":
      if (segs[1]) {
        switch (segs[2]) {
          case "calls":
            return { tag: "calls", pallet: segs[1] };
          case "storage_entries":
            return { tag: "storage_entries", pallet: segs[1] };
          case "constants":
            return { tag: "constants", pallet: segs[1] };
          default:
            return { tag: "pallet", pallet: segs[1], index: -1 };
        }
      } else {
        return undefined;
      }
    default:
      return undefined;
  }
}

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
    case "events":
      return `/pallets/${item.pallet}/events`;
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
    case "events":
      return "Events";
  }
}

const HTML = document.querySelector("html")!;

export type SidebarState = "visible" | "hidden";

export const [sidebarVisibility, setSidebarVisibility]: Signal<SidebarState> =
  createSignal<SidebarState>("hidden");
export function toggleSidebar() {
  setSidebarVisibility((prev) => {
    switch (prev) {
      case "visible":
        return "hidden";
      case "hidden":
        return "visible";
    }
  });
}

// Whenever the sidebar signal changes, we also want to adjust the class on the html.
// This is some baggage from MdBook but we keep it for now.
createEffect((prevSidebar: SidebarState) => {
  let currentSidebar = sidebarVisibility();
  HTML.classList.remove(`sidebar-${prevSidebar}`);
  HTML.classList.add(`sidebar-${currentSidebar}`);
  return currentSidebar;
}, "visible" as SidebarState);
