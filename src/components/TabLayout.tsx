import { JSX } from "solid-js";
import { Tab, Props as TabProps } from "./Tab";

export interface TabWithContent {
  tab: TabProps;
  content: JSX.Element;
}

export interface Props {
  tabs: TabWithContent[];
  tabsContainerClass?: string;
  contentContainerClass?: string;
}

export const TabLayout = (props: Props): JSX.Element => {
  return (
    <>
      <div class={props.tabsContainerClass}>
        {props.tabs.map(({ tab }) => (
          <Tab {...tab}></Tab>
        ))}
      </div>
      <div class={props.contentContainerClass}>
        {props.tabs.map((c) => c.tab.active() && c.content)}
      </div>
    </>
  );
};
