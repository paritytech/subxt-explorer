import { Switch, type Component, Match } from "solid-js";
import { MdBookWrapper } from "./components/MdBookWrapper";
import { MainSection } from "./components/MainSection";
import { StartMain } from "./components/StartMain";
import { greet } from "subxt_example_codegen";
import { Route, Router, Routes } from "@solidjs/router";
import { DynamicMain } from "./components/DynamicMain";

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

      <Router>
        <Routes>
          <Route path="/" component={StartMain}></Route>
          <Route path="/:path" component={DynamicMain}></Route>
        </Routes>
      </Router>
    </MdBookWrapper>
  );
};

export default App;
