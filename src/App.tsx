import { type Component, createEffect } from "solid-js";
import { MdBookWrapper } from "./components/MdBookWrapper";
import { HomePage, HomePageState } from "./pages/Home";
import {
  Route,
  Router,
  Routes,
  hashIntegration,
  useLocation,
  useNavigate,
} from "@solidjs/router";
import { RuntimeApisPage } from "./pages/RuntimeApis";
import { CustomValuesPage } from "./pages/CustomValues";
import { PalletPage } from "./pages/Pallet";
import { CallsPage } from "./pages/Calls";
import { StoragePage } from "./pages/Storage";
import { ConstantsPage } from "./pages/Constants";
import { RuntimeApiMethodsPage } from "./pages/RuntimeApiMethods";
import { EventsPage } from "./pages/Events";
import {
  AppConfig,
  clientKindFromParams,
  clientKindsEqual,
} from "./state/app_config";
import { RedirectToHome } from "./components/RedirectToHome";
import { findSideBarItemByPath, setActiveItem } from "./state/sidebar";

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

  AppConfig.instance.updateWithParams(location.query);

  // listen to all client side solid router route change events:
  // If the url params indicate a different app config, reload the web app with that config.
  createEffect(() => {
    const pathname = location.pathname;

    if (pathname == "/" && HomePageState.instance.generating) {
      // we do not want anything here to trigger if the home page is currently generating some client connection.
      return;
    }

    const newItem = findSideBarItemByPath(pathname);
    if (newItem) {
      setActiveItem(newItem);
    }

    const paramsClientKind = clientKindFromParams(location.query);
    if (!clientKindsEqual(paramsClientKind, AppConfig.instance.clientKind)) {
      AppConfig.instance.updateWith(paramsClientKind);
      if (pathname === "/" || pathname === "") {
        // if already on homepage adjust its UI to the new config:
        HomePageState.instance.adjustUiToAppConfigInstance();
      } else {
        // otherwise navigate to homepage and set redirect hook:
        const redirectUrl = `/?${AppConfig.instance.toParamsString()}`;
        HomePageState.instance.setRedirectPath(pathname);
        const navigate = useNavigate();
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
