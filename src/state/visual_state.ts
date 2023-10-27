import { Signal, createEffect, createSignal } from "solid-js";

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
