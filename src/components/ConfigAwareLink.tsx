import { AnchorProps, Link } from "@solidjs/router";
import { JSX } from "solid-js";
import { AppConfig } from "../state/app_config";
import { findInSidebarItems, setActiveItem } from "../state/sidebar";

/**
 * A wrapper around the solid-js Link/A component that does two things:
 * 1. It uses AppConfig.instance to heep the query params in the href updated to the current config.
 * 2. It sets the active item in the sidebar to the item that is being linked to.
 */
export const ConfigAwareLink = (props: AnchorProps): JSX.Element => {
  return (
    <Link
      {...props}
      activeClass=""
      href={AppConfig.instance.href(props.href)()}
      onClick={() => {
        let splitPath = props.href.split("#")[0];
        let found = findInSidebarItems((e) => e.path == splitPath);
        if (found) {
          setActiveItem(found);
        }
      }}
      style={{ "text-decoration": "none" }}
    >
      <span class="text-gray-300 hover:text-pink-500">{props.children}</span>
    </Link>
  );
};
