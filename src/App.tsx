import { Switch, type Component, Match } from "solid-js";
import { MdBookWrapper } from "./components/MdBookWrapper";
import { HomePage } from "./pages/Home";
import { Route, Router, Routes, hashIntegration } from "@solidjs/router";
import { RuntimeApisPage } from "./pages/RuntimeApis";
import { CustomValuesPage } from "./pages/CustomValues";
import { PalletPage } from "./pages/Pallet";
import { CallsPage } from "./pages/Calls";
import { StoragePage } from "./pages/Storage";
import { ConstantsPage } from "./pages/Constants";
import { RuntimeApiMethodsPage } from "./pages/RuntimeApiMethods";
import { EventsPage } from "./pages/Events";
import { Sidebar } from "./components/Sidebar";

const App: Component = () => {
  return (
    <Router source={hashIntegration()}>
      <MdBookWrapper>
        <Routes>
          <Route path="/" component={HomePage}></Route>
          <Route path="/runtime_apis" component={RuntimeApisPage}></Route>
          <Route
            path="/runtime_apis/:runtime_api"
            component={RuntimeApiMethodsPage}
          ></Route>
          <Route path="/custom_values" component={CustomValuesPage}></Route>
          <Route path="/pallets/:pallet" component={PalletPage}></Route>
          <Route path="/pallets/:pallet/calls" component={CallsPage}></Route>
          <Route path="/pallets/:pallet/events" component={EventsPage}></Route>
          <Route
            path="/pallets/:pallet/storage_entries"
            component={StoragePage}
          ></Route>
          <Route
            path="/pallets/:pallet/constants"
            component={ConstantsPage}
          ></Route>
        </Routes>
      </MdBookWrapper>
    </Router>
  );
};

export default App;
