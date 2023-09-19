import { Signal, createEffect, createSignal } from "solid-js";

export const HTML = document.querySelector("html")!;
export const STORAGE_ADDR_THEME = "mdbook-theme";
export const STORAGE_ADDR_SIDEBAR = "mdbook-sidebar";
export const STORAGE_ADDR_SIDEBAR_SCROLL = "sidebar-scroll";

// Work around some values being stored in localStorage wrapped in quotes.
function localStorageQuoteWorkaround() {
  try {
    var theme = localStorage.getItem("mdbook-theme");
    var sidebar = localStorage.getItem("mdbook-sidebar");

    if (theme?.startsWith('"') && theme.endsWith('"')) {
      localStorage.setItem(
        STORAGE_ADDR_THEME,
        theme.slice(1, theme.length - 1)
      );
    }

    if (sidebar?.startsWith('"') && sidebar.endsWith('"')) {
      localStorage.setItem(
        STORAGE_ADDR_SIDEBAR,
        sidebar.slice(1, sidebar.length - 1)
      );
    }
  } catch (e) {}
}
localStorageQuoteWorkaround();

export type SidebarState = "visible" | "hidden";

export const [sidebar, setSidebar]: Signal<SidebarState> = createSignal(
  initSidebarSignal()
);
export function toggleSidebar() {
  setSidebar((prev) => {
    switch (prev) {
      case "visible":
        return "hidden";
      case "hidden":
        return "visible";
    }
  });
}

function initSidebarSignal(): SidebarState {
  var sidebar = null;
  if (document.body.clientWidth >= 1080) {
    try {
      sidebar = localStorage.getItem(STORAGE_ADDR_SIDEBAR);
    } catch (e) {}
    sidebar = sidebar || "visible";
  } else {
    sidebar = "hidden";
  }
  return sidebar as SidebarState;
}

// Whenever the sidebar signal changes, we also want to adjust the class on the html.
createEffect((prevSidebar: SidebarState) => {
  let currentSidebar = sidebar();
  HTML.classList.remove(`sidebar-${prevSidebar}`);
  HTML.classList.add(`sidebar-${currentSidebar}`);
  return currentSidebar;
}, "visible" as SidebarState);

export type Theme = "light" | "rust" | "coal" | "navy" | "ayu";

export const [theme, setTheme]: Signal<Theme> = createSignal(initThemeSignal());

function initThemeSignal(): Theme {
  let default_theme = "navy";

  // Note: this is how MdBook does theming: currently not used.
  // window.matchMedia("(prefers-color-scheme: dark)").matches
  //   ? "navy"
  //   : "light";
  let themeUnvalidated = undefined;
  try {
    themeUnvalidated = localStorage.getItem(STORAGE_ADDR_THEME);
  } catch (e) {}
  if (
    themeUnvalidated === null ||
    themeUnvalidated === undefined ||
    !["light", "rust", "coal", "navy", "ayu"].includes(themeUnvalidated)
  ) {
    themeUnvalidated = default_theme;
  }

  let theme = themeUnvalidated as Theme;

  // the the theme on the html
  HTML.classList.remove("no-js");
  HTML.classList.add("js");
  return theme as Theme;
}

// whenever theme changes, add/remove the respective class in the html.
createEffect((prevTheme: Theme) => {
  let currentTheme = theme();
  HTML.classList.remove(prevTheme);
  HTML.classList.add(currentTheme);
  return currentTheme;
}, "light" as Theme);
