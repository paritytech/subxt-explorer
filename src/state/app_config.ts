import { Accessor, Setter, createMemo, createSignal, from } from "solid-js";
import { ClientKind } from "./client";
import { Location, useSearchParams } from "@solidjs/router";

/**
 * A config object that is created at the start of the application lifecycle and can be updated at runtime.
 */
export class AppConfig {
  clientKind: ClientKind | undefined;

  // Signal
  #setAppConfigParamString: Setter<string>;
  appConfigParamString: Accessor<string>;

  static #instance: AppConfig;
  static get instance(): AppConfig {
    if (AppConfig.#instance === undefined) {
      AppConfig.#instance = new AppConfig(undefined);
    }
    return AppConfig.#instance;
  }

  static set instance(value: AppConfig) {
    console.log("app config got set: ", value);
    AppConfig.#instance = value;
    value.#setAppConfigParamString(value.toParamsString());
  }

  constructor(clientKind: ClientKind | undefined) {
    this.clientKind = clientKind;
    let [appConfigParamString, setAppConfigParamString] = createSignal<string>(
      this.toParamsString()
    );
    this.appConfigParamString = appConfigParamString;
    this.#setAppConfigParamString = setAppConfigParamString;
  }

  /// Returns a signal that contains an href to a local path with the current app config as a query string.
  href(path: string): Accessor<string> {
    return () => `${path}?${this.toParamsString()}`;
  }

  toParams(): Record<string, string> {
    let params: Record<string, string> = {};

    switch (this.clientKind?.tag) {
      case undefined:
        break;
      case "url":
        params["url"] = this.clientKind.url;
        break;
      case "file":
        break;
    }

    return params;
  }

  toParamsString(): string {
    return paramsToString(this.toParams());
  }

  static fromParams(params: Record<string, string>): AppConfig {
    let clientKind: ClientKind | undefined = undefined;
    let url = params["url"];
    if (url) {
      clientKind = {
        tag: "url",
        url: decodeURI(url),
      };
    }
    return new AppConfig(clientKind);
  }

  equals(other: AppConfig): boolean {
    return clientKindsEqual(this.clientKind, other.clientKind);
  }
}

/**
 * AppConfig contains some basic settings, is initially created from
 * the browser url and local storage and can be updated at runtime.
 */
// export const [appConfig, setAppConfig] = createSignal<AppConfig>({
//   clientKind: undefined,
// });

// export const [
//   latestSuccessfulClientCreation,
//   setLatestSuccessfulClientCreation,
// ] = createSignal<ClientKind | undefined>(undefined);

// export function homeRedirectUrl(fromPath: string): string {
//   // let config = appConfig();
//   let params: Record<string, string> = appConfigToSearchParams(config);
//   params.redirect = fromPath;
//   return `/${paramsToString(params)}`;
// }

//createMemo();

export function paramsToString(params: Record<string, string>): string {
  return new URLSearchParams(Object.entries(params)).toString();
}

export function clientKindsEqual(
  c1: ClientKind | undefined,
  c2: ClientKind | undefined
): boolean {
  if (c1 === c2) {
    return true;
  }

  if (c1 === undefined || c2 === undefined) {
    return false;
  }

  if (c1.tag !== c2.tag) {
    return false;
  }

  switch (c1.tag) {
    case "url":
      return c1.url === (c2 as any).url;
    case "file":
      return true;
  }
}
