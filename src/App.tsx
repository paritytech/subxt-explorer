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
import { ClientKind, initAppState } from "./state/client";
import { wait } from "./utils";
import { AppConfig, paramsToString } from "./state/app_config";
import { RedirectToHome } from "./components/RedirectToHome";

const App: Component = () => {
  return (
    <Router source={hashIntegration()}>
      <AppInRouter />
    </Router>
  );
};

export default App;

const AppInRouter: Component = () => {
  // On page load, create a new AppConfig from the URL params.
  // Note: This code is only called ONCE at the start of the application lifecycle.
  const location = useLocation();
  AppConfig.instance = AppConfig.fromParams(location.query);

  // listen to all client side solid router route change events:
  // If the url params indicate a different app config, reload the web app with that config.
  createEffect(() => {
    let pathname = location.pathname;
    let configFromParams = AppConfig.fromParams(location.query);
    if (!configFromParams.equals(AppConfig.instance)) {
      AppConfig.instance = configFromParams;
      if (pathname === "/" || pathname === "") {
        // if already on homepage adjust its UI to the new config:
        HomePageState.instance.adjustUiToAppConfigInstance();
      } else {
        // otherwise navigate to homepage and set redirect hook:
        let redirectUrl = `/?${configFromParams.toParamsString()}`;
        HomePageState.instance.setRedirectPath(pathname);
        let navigate = useNavigate();
        navigate(redirectUrl, { replace: true });
      }
    }
  });

  return (
    <MdBookWrapper>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/runtime_apis" component={RuntimeApisPage} />
        <Route
          path="/runtime_apis/:runtime_api"
          component={RuntimeApiMethodsPage}
        />
        <Route path="/custom_values" component={CustomValuesPage} />
        <Route path="/pallets/:pallet" component={PalletPage} />
        <Route path="/pallets/:pallet/calls" component={CallsPage} />
        <Route path="/pallets/:pallet/events" component={EventsPage} />
        <Route
          path="/pallets/:pallet/storage_entries"
          component={StoragePage}
        />
        <Route path="/pallets/:pallet/constants" component={ConstantsPage} />
        <Route
          path={"*"}
          component={() => {
            return <RedirectToHome></RedirectToHome>;
          }}
        />
      </Routes>
    </MdBookWrapper>
  );
};
