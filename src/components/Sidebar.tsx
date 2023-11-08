import { Component, For, JSX } from "solid-js";
import { client } from "../state/client";
import {
  HOME_ITEM,
  SidebarItem,
  activeItem,
  sidebarItems,
} from "../state/sidebar";
import { ConfigAwareLink } from "./ConfigAwareLink";
import { ClientCreationData } from "../state/models/client_creation_data";

export const Sidebar: Component = () => {
  return (
    <nav id="sidebar" class="sidebar" aria-label="Table of contents">
      <div class="sidebar-scrollbox">
        <ol class="chapter">
          <li class="chapter-item expanded affix">
            <ConfigAwareLink href={"/"} class="p-0">
              <h1
                class={`my-0 ${
                  activeItem().path == HOME_ITEM.path && "text-pink-500"
                } hover:text-pink-500`}
              >
                Subxt Explorer
              </h1>
            </ConfigAwareLink>
          </li>
          {client() && (
            <li class="part-title leading-6 pt-6 pb-3">
              {clientConnectionSpan(client()!.creationData)}
            </li>
          )}

          <For each={sidebarItems()}>{(item) => <SideBarItem {...item} />}</For>
        </ol>
      </div>
      <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
    </nav>
  );
};

function SideBarItem(item: SidebarItem): JSX.Element {
  if (item.kind.tag === "home") {
    return;
  }

  const topLevel =
    item.kind.tag === "runtime_apis" ||
    item.kind.tag === "pallet" ||
    item.kind.tag === "custom_values";

  return (
    <>
      <li class="chapter-item expanded ">
        <ConfigAwareLink href={item.path}>
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
        </ConfigAwareLink>
      </li>
      {item.children.length != 0 && (
        <li>
          <ol class="section">
            {item.children.map((subitem) => SideBarItem(subitem))}
          </ol>
        </li>
      )}
    </>
  );
}

function clientConnectionSpan(
  clientCreationData: ClientCreationData
): JSX.Element {
  switch (clientCreationData.deref.tag) {
    case "url":
      return (
        <span>
          {"Connected to: "}
          <span class="text-pink-500">{clientCreationData.deref.url}</span>
        </span>
      );
    case "file":
      return (
        <span>
          {"Metadata from: "}
          <span class="text-pink-500">
            {clientCreationData.deref.file.name}
          </span>
        </span>
      );
    case "lightclient":
      return <span>{"Connected to LightClient"}</span>;
  }
}

/*

Todo:
In MdBook there is some code to scroll the sidebar to the correct item, we probably need something similar:

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
