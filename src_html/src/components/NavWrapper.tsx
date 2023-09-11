import { Component } from "solid-js";
interface Props {}
export const NavWrapper: Component<Props> = (props: Props) => {
  return (
    <nav class="nav-wrapper" aria-label="Page navigation">
      <a
        rel="prev"
        href="chapter_1.html"
        class="mobile-nav-chapters previous"
        title="Previous chapter"
        aria-label="Previous chapter"
        aria-keyshortcuts="Left"
      >
        <i class="fa fa-angle-left"></i>
      </a>

      <a
        rel="next"
        href="chapter_2/get started.html"
        class="mobile-nav-chapters next"
        title="Next chapter"
        aria-label="Next chapter"
        aria-keyshortcuts="Right"
      >
        <i class="fa fa-angle-right"></i>
      </a>

      <div style="clear: both"></div>
    </nav>
  );
};
