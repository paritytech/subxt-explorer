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
import { HomePage, HomePageState } from "./pages/Home";
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
import { ClientKind, initAppState } from "./state/client_wrapper";
import { wait } from "./utils";
import { DebugComponent } from "./components/DebugComponent";
import { AppConfig, paramsToString } from "./state/app_config";

const App: Component = () => {
  // this happens only once on page load:
  const location = useLocation();
  let config = AppConfig.fromParams(location.query);
  HomePageState.instance.appConfig = config;

  // listen to all client side solid router route change events:
  // If the url params indicate a different app config, reload the web app with that config.
  createEffect(() => {
    let pathname = location.pathname;
    let params = location.query;

    let configFromParams = AppConfig.fromParams(params);
    console.log(
      "CreateEffect: ",
      pathname,
      Object.entries(params),
      configFromParams
    );
    if (!configFromParams.equals(HomePageState.instance.appConfig)) {
      console.log(
        "CreateEffect: config changed to",
        configFromParams,
        location.pathname
      );
      HomePageState.instance.appConfig = configFromParams;
      if (pathname === "/" || pathname === "") {
        console.log("HOME");
        // if already on homepage adjust its UI to the new config:
        HomePageState.instance.onHomePageLoad();
      } else {
        console.log("NOT HOME:", pathname);
        // otherwise navigate to homepage and set redirect hook:
        let redirectUrl = `/?${configFromParams.toParamsString()}`;
        console.log("WAS NOT AT HOME: redirecting to", redirectUrl);
        HomePageState.instance.setRedirectPath(pathname);
        let navigate = useNavigate();
        navigate(redirectUrl, { replace: true });
      }
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
