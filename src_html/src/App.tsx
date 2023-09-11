import { Switch, type Component, Match } from "solid-js";
import { Wrapper } from "./Wrapper";
import { MdBookWrapper } from "./components/MdBookWrapper";
import { SidebarHierarchy } from "./models/hierarchy";
import { Content } from "./models/content";
import { MainSection } from "./components/MainSection";
import { StartPageMainSection } from "./components/StartPageMainSection";

const App: Component = () => {
  return (
    <MdBookWrapper>
      <StartPageMainSection />
    </MdBookWrapper>
  );
};

export default App;
