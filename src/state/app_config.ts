import { createMemo, createSignal } from "solid-js";
import { ClientKind } from "./app_state";
import { useSearchParams } from "@solidjs/router";

export interface AppConfig {
  clientKind: ClientKind | undefined;
}

/**
 * AppConfig contains some basic settings, is initially created from
 * the browser url and local storage and can be updated at runtime.
 */
export const [appConfig, setAppConfig] = createSignal<AppConfig>({
  clientKind: undefined,
});

export const searchParamString = createMemo(() => {
  let params = appConfigToSearchParams(appConfig());
  let paramString =
    "?" +
    Object.entries(params)
      .map((kv) => kv.map(encodeURIComponent).join("="))
      .join("&");
  return paramString;
});

/**
 * updates the url and the appConfig state.
 */
export function setClientKindOfAppConfig(
  clientKind: ClientKind,
  setSearchParams: (params: Record<string, string>) => void
) {
  setAppConfig((prev) => {
    let next: AppConfig = { ...prev, clientKind };
    setSearchParams(appConfigToSearchParams(next));
    return next;
  });
  // setAppConfig(clientKind);
}

function appConfigToSearchParams(config: AppConfig): Record<string, string> {
  let params: Record<string, string> = {};

  switch (config.clientKind?.tag) {
    case undefined:
      break;
    case "url":
      params["url"] = config.clientKind.url;
      break;
    case "file":
      break;
  }

  return params;
}

export function extractAppConfigFromSearchParams(
  params: Record<string, string>
): AppConfig {
  let clientKind: ClientKind | undefined = undefined;
  let url = params["url"];
  if (url) {
    clientKind = {
      tag: "url",
      url: decodeURI(url),
    };
  }
  let config = {
    clientKind,
  };
  console.log("extracting app config from url:", config);

  return config;
}

// // export function clientKindsAreTheSame(
// //   c1: ClientKind | undefined,
// //   c2: ClientKind | undefined
// // ): boolean {
// //   if (c1 === c2) {
// //     return true;
// //   }

// //   if (c1 === undefined || c2 === undefined) {
// //     return false;
// //   }

// //   if (c1.tag !== c2.tag) {
// //     return false;
// //   }

// //   switch (c1.tag) {
// //     case "url":
// //       return c1.url === (c2 as any).url;
// //     case "file":
// //       return true;
// //   }
// // }
