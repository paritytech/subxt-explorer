import { Link } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { SidebarItem, activeItem, setActiveItem } from "../state/sidebar_state";
import { HomePageState } from "../pages/Home";
import { AppConfig } from "../state/app_config";
interface Props {
  activeItem: SidebarItem;
}
export const NavWrapper: Component<Props> = (props: Props) => {
  return (
    <nav class="nav-wrapper" aria-label="Page navigation">
      <Show when={props.activeItem.prev !== undefined}>
        <Link
          rel="prev"
          href={`${
            props.activeItem.prev!.path
          }?${AppConfig.instance.appConfigParamString()}`}
          class="mobile-nav-chapters previous"
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
          }?${AppConfig.instance.appConfigParamString()}`}
          class="mobile-nav-chapters next"
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

      <div style="clear: both"></div>
    </nav>
  );
};
