import {
  Component,
  JSX,
  Match,
  Ref,
  Switch,
  onCleanup,
  onMount,
} from "solid-js";
import { Sidebar } from "./Sidebar";
import { NavWrapper } from "./NavWrapper";
import { NavWideWrapper } from "./NavWideWrapper";
import { MenuBar } from "./MenuBar";
import { sidebar } from "../state/visual_state";
import { HomePage } from "../pages/Home";
import { appState } from "../state/app_state";

interface Props {
  children?: JSX.Element;
}

export const MdBookWrapper: Component<Props> = (props: Props) => {
  return (
    <>
      <Sidebar></Sidebar>

      <div id="page-wrapper" class="page-wrapper">
        <div class="page">
          <MenuBar></MenuBar>

          <div id="content" class="content">
            <main>{props.children}</main>

            <NavWrapper></NavWrapper>
          </div>

          <NavWideWrapper></NavWideWrapper>
        </div>
      </div>
    </>
  );
};
