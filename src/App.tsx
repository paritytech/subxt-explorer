import {
  Switch,
  type Component,
  Match,
  createResource,
  Suspense,
  Show,
  createEffect,
  useTransition,
  useContext,
} from "solid-js";
import { MdBookWrapper } from "./components/MdBookWrapper";
import { HomePage } from "./pages/Home";
import {
  Navigate,
  Route,
  Router,
  Routes,
  hashIntegration,
  memoryIntegration,
  pathIntegration,
  useBeforeLeave,
  useLocation,
  useNavigate,
  useRouteData,
  useSearchParams,
} from "@solidjs/router";
import { RuntimeApisPage } from "./pages/RuntimeApis";
import { CustomValuesPage } from "./pages/CustomValues";
import { PalletPage } from "./pages/Pallet";
import { CallsPage } from "./pages/Calls";
import { StoragePage } from "./pages/Storage";
import { ConstantsPage } from "./pages/Constants";
import { RuntimeApiMethodsPage } from "./pages/RuntimeApiMethods";
import { EventsPage } from "./pages/Events";
import { Sidebar } from "./components/Sidebar";
import { ClientKind, initAppState } from "./state/app_state";
import { wait } from "./utils";
import { DebugComponent } from "./components/DebugComponent";
import {
  appConfig,
  appConfigEquals,
  appConfigSearchParamString,
  extractAppConfigAndPath,
  extractAppConfigFromSearchParams as extractAppConfigFromParams,
  homeRedirectUrl,
  setAppConfig,
  setLatestSuccessfulClientCreation,
} from "./state/app_config";
import { useRouter } from "@solidjs/router/dist/routing";

const App: Component = () => {
  // this happens only once on page load:
  const location = useLocation();
  let configAndPath = extractAppConfigAndPath(location);
  console.log("page load: extracted config and path: ", configAndPath);
  setAppConfig(configAndPath.config);

  if (!(configAndPath.pathname === "/" || configAndPath.pathname === "")) {
    let redirectUrl = homeRedirectUrl(configAndPath.pathname);
    setLatestSuccessfulClientCreation(undefined);
    let navigate = useNavigate();
    navigate(redirectUrl, { replace: true });
  }

  // listen to all client side solid router route change events:
  // If the url params indicate a different app config, reload the web app with that config.
  createEffect(() => {
    console.log("route changed", location.pathname);

    let pathname = location.pathname;
    let query = location.query;

    let appConfigFromParams = extractAppConfigFromParams(query);
    if (!appConfigEquals(appConfigFromParams, appConfig())) {
      console.log("difference found: ", appConfigFromParams, appConfig());
      console.log("query was: ", query);
      // setAppConfig(appConfigFromParams);
      // let redirectUrl = homeRedirectUrl(pathname);
      // console.log("redirecting to", redirectUrl);
      // let navigate = useNavigate();
      // navigate(redirectUrl);
    }
  });

  return (
    <MdBookWrapper>
      <Routes>
        <Route path="/debug" component={DebugComponent}></Route>
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
  );
};

export default App;
