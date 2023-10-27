import { A, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { ClientWrapper, clientWrapper } from "../state/client_wrapper";
import { JSX } from "solid-js";
import { TryToLink } from "../components/TryLinkTo";
import { RedirectToHome } from "../components/RedirectToHome";
import { HomePageState } from "./Home";

export const RuntimeApisPage = () => {
  if (!clientWrapper()?.content.runtime_apis.length) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>Runtime APIs</h1>
      {clientWrapper()!.content.runtime_apis.map((runtimeApi) => (
        <>
          <h2 class="mt-12">
            <TryToLink
              href={`/runtime_apis/${
                runtimeApi.name
              }?${AppConfig.instance.appConfigParamString()}`}
            >
              {runtimeApi.name}
            </TryToLink>
          </h2>
          <ul>
            {runtimeApi.methods.map((method) => (
              <li>
                <TryToLink
                  href={`/runtime_apis/${
                    runtimeApi.name
                  }#${method}?${AppConfig.instance.appConfigParamString()}`}
                >
                  {method}
                </TryToLink>
              </li>
            ))}
          </ul>
        </>
      ))}
    </>
  );
};
