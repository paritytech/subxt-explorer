import { Component, JSX, Ref, onCleanup, onMount } from "solid-js";
import { SidebarHierarchy } from "../models/hierarchy";

interface Props {}

export const Sidebar: Component<Props> = (props: Props) => {
  return (
    <nav id="sidebar" class="sidebar" aria-label="Table of contents">
      <div class="sidebar-scrollbox">
        <ol class="chapter">
          <li class="chapter-item expanded ">
            <a href="chapter_1.html" class="active">
              <strong aria-hidden="true">1.</strong> Chapter 1
            </a>
          </li>
          <li class="chapter-item expanded ">
            <a href="chapter_2.html">
              <strong aria-hidden="true">2.</strong> Chapter 2
            </a>
          </li>
          <li>
            <ol class="section">
              <li class="chapter-item expanded ">
                <a href="chapter_2/get started.html">
                  <strong aria-hidden="true">2.1.</strong> Getting started
                </a>
              </li>
              <li class="chapter-item expanded ">
                <a href="chapter_2/important differences.html">
                  <strong aria-hidden="true">2.2.</strong> Important Differences
                </a>
              </li>
            </ol>
          </li>
        </ol>
      </div>
      <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
    </nav>
  );
};

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
