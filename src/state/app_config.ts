import { Accessor, Setter, createSignal } from "solid-js";
import { ClientKind } from "./client";

/**
 * A config object that is created at the start of the application lifecycle and can be updated at runtime.
 */
export class AppConfig {
  clientKind: ClientKind | undefined;

  // Signal used mainly in href of links.
  #setAppConfigParamString: Setter<string>;
  appConfigParamString: Accessor<string>;

  static #instance: AppConfig;
  static get instance(): AppConfig {
    if (AppConfig.#instance === undefined) {
      AppConfig.#instance = new AppConfig(undefined);
    }
    return AppConfig.#instance;
  }

  updateWith(clientKind: ClientKind | undefined) {
    this.clientKind = clientKind;
    this.#setAppConfigParamString(this.toParamsString());
  }

  constructor(clientKind: ClientKind | undefined) {
    this.clientKind = clientKind;
    const [appConfigParamString, setAppConfigParamString] =
      createSignal<string>(this.toParamsString());
    this.appConfigParamString = appConfigParamString;
    this.#setAppConfigParamString = setAppConfigParamString;
  }

  /// Returns a signal that contains an href to a local path with the current app config as a query string.
  href(path: string): Accessor<string> {
    return () => `${path}?${this.appConfigParamString()}`;
  }

  toParams(): Record<string, string> {
    const params: Record<string, string> = clientKindToParams(this.clientKind);
    return params;
  }

  toParamsString(): string {
    return paramsToString(this.toParams());
  }

  updateWithParams(params: Record<string, string>) {
    this.clientKind = clientKindFromParams(params);
  }

  equals(other: AppConfig): boolean {
    return clientKindsEqual(this.clientKind, other.clientKind);
  }
}

export function clientKindFromParams(
  params: Record<string, string>
): ClientKind | undefined {
  const url = params["url"];
  if (url) {
    return {
      tag: "url",
      url: decodeURI(url),
    };
  }
  return undefined;
}

export function clientKindToParams(
  clientKind: ClientKind | undefined
): Record<string, string> {
  const params: Record<string, string> = {};
  if (clientKind?.tag === "url") {
    params["url"] = clientKind.url;
  }
  return params;
}

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
      return c1.url === (c2 as { tag: "url"; url: string }).url;
    case "file":
      return true;
    case "lightclient":
      return true;
  }
}
