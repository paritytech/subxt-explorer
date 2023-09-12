import { Switch, type Component, Match } from "solid-js";
import { MdBookWrapper } from "./components/MdBookWrapper";
import { SidebarHierarchy } from "./models/hierarchy";
import { Content } from "./models/content";
import { MainSection } from "./components/MainSection";
import { StartPageMainSection } from "./components/StartPageMainSection";
import { greet } from "subxt_example_codegen";

const App: Component = () => {
  return (
    <MdBookWrapper>
      <button
        onClick={async () => {
          let bytes = new Uint8Array([0, 1, 2, 3, 4]);

          // try {
          //   let me = await Metadata.from_url("wss://rpc.polkadot.io");
          // } catch (ex) {
          //   console.log(ex);
          // }

          // try {
          //   let me = Metadata.from_bytes(bytes);
          // } catch (ex) {
          //   console.log(ex);
          // }
        }}
      >
        Click me
      </button>
      <StartPageMainSection />
    </MdBookWrapper>
  );
};

export default App;
