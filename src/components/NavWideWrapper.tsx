import { Component, Show } from "solid-js";
import { SidebarItem } from "../state/sidebar";
import { ConfigAwareLink } from "./ConfigAwareLink";
interface Props {
  activeItem: SidebarItem;
}
export const NavWideWrapper: Component<Props> = (props: Props) => {
  return (
    <nav class="nav-wide-wrapper" aria-label="Page navigation">
      <Show when={props.activeItem.prev !== undefined}>
        <ConfigAwareLink
          rel="prev"
          href={props.activeItem.prev!.path}
          class="nav-chapters previous"
          title={props.activeItem.prev!.title}
          aria-label="Previous Page"
          aria-keyshortcuts="Left"
        >
          <i class="fa fa-angle-left"></i>
        </ConfigAwareLink>
      </Show>

      <Show when={props.activeItem.next !== undefined}>
        <ConfigAwareLink
          rel="next"
          href={props.activeItem.next!.path}
          class="nav-chapters next"
          title={props.activeItem.next!.title}
          aria-label="Next Page"
          aria-keyshortcuts="Right"
        >
          <i class="fa fa-angle-right"></i>
        </ConfigAwareLink>
      </Show>
    </nav>
  );
};
