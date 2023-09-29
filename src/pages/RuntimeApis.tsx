import { A, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { TryToLink } from "../components/TryLinkTo";

export const RuntimeApisPage = () => {
  if (!appState()?.content.runtime_apis.length) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>Runtime APIs</h1>
      {appState()!.content.runtime_apis.map((runtimeApi) => (
        <>
          <h2 class="mt-12">
            <TryToLink href={`/runtime_apis/${runtimeApi.name}`}>
              {runtimeApi.name}
            </TryToLink>
          </h2>
          <ul>
            {runtimeApi.methods.map((method) => (
              <li>
                <TryToLink href={`/runtime_apis/${runtimeApi.name}#${method}`}>
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
