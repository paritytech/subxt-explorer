import { Navigate, useLocation } from "@solidjs/router";
import { JSX } from "solid-js";
import { HomePageState } from "../pages/Home";
import { ClientCreationConfig } from "../state/models/client_creation_config";
import { paramsToString } from "../utils";

export function RedirectToHome(): JSX.Element {
  const location = useLocation();
  const clientCreationConfig = ClientCreationConfig.tryFromParams(
    location.query
  );
  const params = {
    config: clientCreationConfig?.encodeToString() ?? "",
  };
  const redirectUrl = `/?${paramsToString(params)}`;
  HomePageState.instance.setRedirectPath(location.pathname);
  return <Navigate href={redirectUrl} />;
}
