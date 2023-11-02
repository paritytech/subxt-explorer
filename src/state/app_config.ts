import { Accessor, Setter, createSignal } from "solid-js";
import { ClientCreationConfig } from "./models/client_creation_config";
import { paramsToString } from "../utils";

/**
 * A config object that is created at the start of the application lifecycle and can be updated at runtime.
 */
export class AppConfig {
  clientCreationConfig: ClientCreationConfig | undefined;
  lastSuccessFullClientCreationConfig: ClientCreationConfig | undefined;

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

  updateWith(clientCreationConfig: ClientCreationConfig | undefined) {
    this.clientCreationConfig = clientCreationConfig;
    this.#setAppConfigParamString(this.toParamsString());
  }

  constructor(clientCreationConfig: ClientCreationConfig | undefined) {
    this.clientCreationConfig = clientCreationConfig;
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
    return this.clientCreationConfig?.intoParams() ?? {};
  }

  toParamsString(): string {
    return paramsToString(this.toParams());
  }

  updateWithParams(params: Record<string, string>) {
    this.clientCreationConfig = ClientCreationConfig.tryFromParams(params);
    console.log(
      "AppConfig: updated with params: ",
      params,
      this.clientCreationConfig
    );
  }

  equals(other: AppConfig): boolean {
    return ClientCreationConfig.equals(
      this.clientCreationConfig,
      other.clientCreationConfig
    );
  }
}
