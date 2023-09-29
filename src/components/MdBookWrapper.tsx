import { Component, JSX } from "solid-js";
import { Sidebar } from "./Sidebar";
import { NavWrapper } from "./NavWrapper";
import { NavWideWrapper } from "./NavWideWrapper";
import { MenuBar } from "./MenuBar";
import { activeItem } from "../state/sidebar_state";

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

            <NavWrapper activeItem={activeItem()}></NavWrapper>
          </div>

          <NavWideWrapper activeItem={activeItem()}></NavWideWrapper>
        </div>
      </div>
    </>
  );
};
