import { Component, For, JSX, createSignal } from "solid-js";
import { MetadataSource, appState } from "../state/app_state";
import { Link } from "@solidjs/router";
import {
  HOME_ITEM,
  SidebarItem,
  activeItem,
  newItem,
  setActiveItem,
  sidebarItems,
} from "../state/sidebar";
interface Props {}

export const Sidebar: Component<Props> = (props: Props) => {
  return (
    <nav id="sidebar" class="sidebar" aria-label="Table of contents">
      <div class="sidebar-scrollbox">
        <ol class="chapter">
          <li class="chapter-item expanded affix">
            <Link
              href="/"
              activeClass=""
              onClick={() => {
                setActiveItem(HOME_ITEM);
              }}
              class="p-0"
            >
              <h1
                class={`my-0 ${
                  activeItem().path == HOME_ITEM.path && "text-pink-500"
                } hover:text-pink-500`}
              >
                Subxt Explorer
              </h1>
            </Link>
          </li>
          {appState() && (
            <li class="part-title leading-6 pt-6 pb-3">
              {metadataSourceSpan(appState()!.source)}
            </li>
          )}

          <For each={sidebarItems()}>{(item, i) => sideBarItem(item)}</For>
        </ol>
      </div>
      <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
    </nav>
  );
};

function sideBarItem(item: SidebarItem): JSX.Element {
  // let params = useParams<{ path?: string }>();

  let topLevel =
    item.kind.tag === "runtime_apis" ||
    item.kind.tag === "pallet" ||
    item.kind.tag === "custom_values";

  return (
    <>
      <li class="chapter-item expanded ">
        <Link
          href={item.path}
          activeClass=""
          onClick={() => {
            setActiveItem(item);
          }}
          // class={activeItem().path === item.path ? "active" : ""}
          // class="text-gray-300 hover:text-pink-500"
          style={{}}
        >
          <span
            class={`${
              activeItem().path === item.path
                ? "text-pink-500"
                : "text-gray-300"
            } hover:text-pink-500`}
          >
            {!topLevel && <strong>&bull; </strong>}

            <span class={topLevel ? "font-bold" : ""}>{item.title}</span>
            {item.kind.tag === "pallet" && (
              <span aria-hidden="true" class="text-gray-500">
                {" "}
                index={item.kind.index}{" "}
              </span>
            )}
          </span>
        </Link>
      </li>
      {item.children.length != 0 && (
        <li>
          <ol class="section">
            {item.children.map((subitem) => sideBarItem(subitem))}
          </ol>
        </li>
      )}
    </>
  );
}

function metadataSourceSpan(source: MetadataSource): JSX.Element {
  switch (source.tag) {
    case "url":
      return (
        <span>
          {"Connected to: "}
          <span class="text-pink-500">{source.url}</span>
        </span>
      );
    case "file":
      return (
        <span>
          {"Metadata from: "}
          <span class="text-pink-500">{source.file.name}</span>
        </span>
      );
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
