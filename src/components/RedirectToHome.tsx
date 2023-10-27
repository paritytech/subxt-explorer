import { Navigate, useLocation } from "@solidjs/router";
import { AppConfig } from "../state/app_config";
import { JSX } from "solid-js";
import { HomePageState } from "../pages/Home";

export function RedirectToHome(): JSX.Element {
  const location = useLocation();
  const config = AppConfig.fromParams(location.query);
  const redirectUrl = `/?${config.toParamsString()}`;
  HomePageState.instance.setRedirectPath(location.pathname);
  return <Navigate href={redirectUrl} />;
}
