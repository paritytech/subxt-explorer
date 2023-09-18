import { A, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { TryToLink } from "../components/TryLinkTo";

export const RuntimeApisPage = () => {
  return <MdBookWrapper>{runtimeApisPageContent(appState())}</MdBookWrapper>;
};

function runtimeApisPageContent(state: AppState | undefined): JSX.Element {
  if (!state?.content.runtime_apis.length) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>Runtime APIs</h1>

      {state!.content.runtime_apis.map((runtimeApi) => (
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
}
