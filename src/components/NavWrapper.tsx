import { Link } from "@solidjs/router";
import { Component } from "solid-js";
import { activeItem, setActiveItem } from "../state/sidebar_state";
interface Props {}
export const NavWrapper: Component<Props> = (props: Props) => {
  return (
    <nav class="nav-wrapper" aria-label="Page navigation">
      {activeItem().prev && (
        <Link
          rel="prev"
          href={activeItem().prev!.path}
          class="mobile-nav-chapters previous"
          title={activeItem().prev!.title}
          aria-label="Previous chapter"
          aria-keyshortcuts="Left"
          onClick={() => {
            setActiveItem(activeItem().prev!);
          }}
        >
          <i class="fa fa-angle-left"></i>
        </Link>
      )}

      {activeItem().next && (
        <Link
          rel="next"
          href={activeItem().next!.path}
          class="mobile-nav-chapters next"
          title={activeItem().next!.title}
          aria-label="Next chapter"
          aria-keyshortcuts="Right"
          onClick={() => {
            setActiveItem(activeItem().next!);
          }}
        >
          <i class="fa fa-angle-right"></i>
        </Link>
      )}

      <div style="clear: both"></div>
    </nav>
  );
};

{
  activeItem().prev && (
    <Link
      rel="prev"
      href={activeItem().prev!.path}
      class="nav-chapters previous"
      title={activeItem().prev!.title}
      aria-label="Previous chapter"
      aria-keyshortcuts="Left"
      onClick={() => {
        setActiveItem(activeItem().prev!);
      }}
    >
      <i class="fa fa-angle-left"></i>
    </Link>
  );
}

{
  activeItem().next && (
    <Link
      rel="next"
      href={activeItem().next!.path}
      class="nav-chapters next"
      title={activeItem().next!.title}
      aria-label="Next chapter"
      aria-keyshortcuts="Right"
      onClick={() => {
        setActiveItem(activeItem().next!);
      }}
    >
      <i class="fa fa-angle-right"></i>
    </Link>
  );
}
