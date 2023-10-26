import { Component, onMount } from "solid-js";
import { setSidebarVisibility, toggleSidebar } from "../state/visual_state";
interface Props {}
export const MenuBar: Component<Props> = (props: Props) => {
  return (
    <>
      <div id="menu-bar-hover-placeholder"></div>
      <div id="menu-bar" class="menu-bar sticky">
        <div class="left-buttons">
          <button
            id="sidebar-toggle"
            class="icon-button"
            type="button"
            title="Toggle Table of Contents"
            aria-label="Toggle Table of Contents"
            aria-controls="sidebar"
            onClick={toggleSidebar}
          >
            <i class="fa fa-bars"></i>
          </button>
          {/* <button
            id="theme-toggle"
            class="icon-button"
            type="button"
            title="Change theme"
            aria-label="Change theme"
            aria-haspopup="true"
            aria-expanded="false"
            aria-controls="theme-list"
          >
            <i class="fa fa-paint-brush"></i>
          </button> */}
          {/* <ul
            id="theme-list"
            class="theme-popup"
            aria-label="Themes"
            role="menu"
          >
            <li role="none">
              <button role="menuitem" class="theme" id="light">
                Light
              </button>
            </li>
            <li role="none">
              <button role="menuitem" class="theme" id="rust">
                Rust
              </button>
            </li>
            <li role="none">
              <button role="menuitem" class="theme" id="coal">
                Coal
              </button>
            </li>
            <li role="none">
              <button role="menuitem" class="theme" id="navy">
                Navy
              </button>
            </li>
            <li role="none">
              <button role="menuitem" class="theme" id="ayu">
                Ayu
              </button>
            </li>
          </ul>
          <button
            id="search-toggle"
            class="icon-button"
            type="button"
            title="Search. (Shortkey: s)"
            aria-label="Toggle Searchbar"
            aria-expanded="false"
            aria-keyshortcuts="S"
            aria-controls="searchbar"
          >
            <i class="fa fa-search"></i>
          </button> */}
        </div>

        <h1 class="menu-title">Subxt Explorer</h1>

        <div class="right-buttons">
          {/* <a
            href="print.html"
            title="Print this book"
            aria-label="Print this book"
          >
            <i id="print-button" class="fa fa-print"></i>
          </a> */}
        </div>
      </div>

      <div id="search-wrapper" class="hidden">
        <form id="searchbar-outer" class="searchbar-outer">
          <input
            type="search"
            id="searchbar"
            name="searchbar"
            placeholder="Search this book ..."
            aria-controls="searchresults-outer"
            aria-describedby="searchresults-header"
          />
        </form>
        <div id="searchresults-outer" class="searchresults-outer hidden">
          <div id="searchresults-header" class="searchresults-header"></div>
          <ul id="searchresults"></ul>
        </div>
      </div>
    </>
  );
};
