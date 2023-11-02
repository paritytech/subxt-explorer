import { Navigate, useLocation } from "@solidjs/router";
import {
  clientCreationConfigFromParams,
  clientKindToParams,
  paramsToString,
} from "../state/app_config";
import { JSX } from "solid-js";
import { HomePageState } from "../pages/Home";

export function RedirectToHome(): JSX.Element {
  const location = useLocation();
  const clientKind = clientCreationConfigFromParams(location.query);
  const params = clientKindToParams(clientKind);
  const redirectUrl = `/?${paramsToString(params)}`;
  HomePageState.instance.setRedirectPath(location.pathname);
  return <Navigate href={redirectUrl} />;
}
