import { Component, createSignal } from "solid-js";
import { TabLayout, TabWithContent } from "./TabLayout";
import { Code } from "./Code";
interface Props {
  staticCode: string;
  dynamicCode: string;
}
export const CodeTabLayout: Component<Props> = (props: Props) => {
  const [tab, setTab] = createSignal<"static" | "dynamic">("static");

  const tabs: TabWithContent[] = [
    {
      tab: {
        title: "Static Code Example",
        active: () => tab() == "static",
        icon: "fa-cube",
        onClick: () => setTab("static"),
      },
      content: <Code code={props.staticCode}></Code>,
    },
    {
      tab: {
        title: "Dynamic Code Example",
        active: () => tab() == "dynamic",
        icon: "fa-bomb",
        onClick: () => setTab("dynamic"),
      },
      content: <Code code={props.dynamicCode}></Code>,
    },
  ];

  return <TabLayout tabs={tabs} contentContainerClass=""></TabLayout>;
};
