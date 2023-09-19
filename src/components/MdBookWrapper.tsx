import { Component, JSX } from "solid-js";
import { Sidebar } from "./Sidebar";
import { NavWrapper } from "./NavWrapper";
import { NavWideWrapper } from "./NavWideWrapper";
import { MenuBar } from "./MenuBar";

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
