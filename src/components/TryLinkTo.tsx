import { Link } from "@solidjs/router";
import { JSX } from "solid-js";
import { findInSidebarItems, setActiveItem } from "../state/sidebar_state";

// a Link component that tries to find the correct sidebar item and sets the active side bar item if the href matches.
export const TryToLink = (props: {
  href: string;
  children: JSX.Element;
}): JSX.Element => {
  return (
    <Link
      activeClass=""
      href={props.href}
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
