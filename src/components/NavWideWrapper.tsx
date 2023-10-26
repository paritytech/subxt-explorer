import { Component, Show } from "solid-js";
import { SidebarItem, activeItem, setActiveItem } from "../state/sidebar_state";
import { Link } from "@solidjs/router";
import { HomePageState } from "../pages/Home";
interface Props {
  activeItem: SidebarItem;
}
export const NavWideWrapper: Component<Props> = (props: Props) => {
  return (
    <nav class="nav-wide-wrapper" aria-label="Page navigation">
      <Show when={props.activeItem.prev !== undefined}>
        <Link
          rel="prev"
          href={`${
            props.activeItem.prev!.path
          }?${HomePageState.instance.appConfigParamString()}`}
          class="nav-chapters previous"
          title={props.activeItem.prev!.title}
          aria-label="Previous chapter"
          aria-keyshortcuts="Left"
          onClick={() => {
            setActiveItem(props.activeItem.prev!);
          }}
        >
          <i class="fa fa-angle-left"></i>
        </Link>
      </Show>

      <Show when={props.activeItem.next !== undefined}>
        <Link
          rel="next"
          href={`${
            props.activeItem.next!.path
          }?${HomePageState.instance.appConfigParamString()}`}
          class="nav-chapters next"
          title={props.activeItem.next!.title}
          aria-label="Next chapter"
          aria-keyshortcuts="Right"
          onClick={() => {
            setActiveItem(props.activeItem.next!);
          }}
        >
          <i class="fa fa-angle-right"></i>
        </Link>
      </Show>
    </nav>
  );
};
