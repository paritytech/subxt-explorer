import { Component, For, JSX, Ref, onCleanup, onMount } from "solid-js";
import {
  AppState,
  MetadataSource,
  appState,
  sidebarItems,
} from "../state/app_state";
import { A, useParams } from "@solidjs/router";
import { SidebarItem } from "../models/sidebar";
interface Props {}

export const Sidebar: Component<Props> = (props: Props) => {
  return (
    <nav id="sidebar" class="sidebar" aria-label="Table of contents">
      <div class="sidebar-scrollbox">
        <ol class="chapter">
          <li class="chapter-item expanded affix">
            <A
              href="/"
              activeClass=""
              // class={!params.path || params.path === "/" ? "active" : ""}
            >
              Subxt Explorer
              {/* {JSON.stringify(useParams<{ path?: string }>())} */}
            </A>
          </li>
          {appState() && (
            <li class="part-title">
              <div class="text-teal-400">
                {metadataSourceString(appState()!.source)}
              </div>
            </li>
          )}
          <For each={sidebarItems()}>
            {(item, i) => sideBarItem(item, `${i() + 1}.`)}
          </For>
        </ol>
      </div>
      <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
    </nav>
  );
};

function sideBarItem(item: SidebarItem, prefix: string): JSX.Element {
  let params = useParams<{ path?: string }>();

  return (
    <>
      <li class="chapter-item expanded ">
        <A href={item.path} class={params.path === item.path ? "active" : ""}>
          <strong aria-hidden="true">{prefix}</strong> {item.title}{" "}
          {params.path}
        </A>
      </li>
      {item.children.length != 0 && (
        <li>
          <ol class="section">
            {item.children.map((subitem, j) =>
              sideBarItem(subitem, `${prefix}${j + 1}.`)
            )}
          </ol>
        </li>
      )}
    </>
  );
}

function metadataSourceString(source: MetadataSource): string {
  switch (source.tag) {
    case "url":
      return `${source.url}`;
    case "file":
      return `${source.file.name}`;
  }
}

/*


The scrolling code above is adapted from this, which is from some md book js snippet

<!-- Track and set sidebar scroll position -->
<script>
  var sidebarScrollbox = document.querySelector(
    "#sidebar .sidebar-scrollbox"
  );
  sidebarScrollbox.addEventListener(
    "click",
    function (e) {
      if (e.target.tagName === "A") {
        sessionStorage.setItem(
          "sidebar-scroll",
          sidebarScrollbox.scrollTop
        );
      }
    },
    { passive: true }
  );
  var sidebarScrollTop = sessionStorage.getItem("sidebar-scroll");
  sessionStorage.removeItem("sidebar-scroll");
  if (sidebarScrollTop) {
    // preserve sidebar scroll position when navigating via links within sidebar
    sidebarScrollbox.scrollTop = sidebarScrollTop;
  } else {
    // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
    var activeSection = document.querySelector("#sidebar .active");
    if (activeSection) {
      activeSection.scrollIntoView({ block: "center" });
    }
  }
</script>


*/
