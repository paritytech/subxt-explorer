import { A, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { Client, client } from "../state/client";
import { JSX } from "solid-js";
import { RedirectToHome } from "../components/RedirectToHome";
import { HomePageState } from "./Home";
import { AppConfig } from "../state/app_config";
import { ConfigAwareLink } from "../components/ConfigAwareLink";

export const RuntimeApisPage = () => {
  if (!client()?.content.runtime_apis.length) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>Runtime APIs</h1>
      {client()!.content.runtime_apis.map((runtimeApi) => (
        <>
          <h2 class="mt-12">
            <ConfigAwareLink href={`/runtime_apis/${runtimeApi.name}`}>
              {runtimeApi.name}
            </ConfigAwareLink>
          </h2>
          <ul>
            {runtimeApi.methods.map((method) => (
              <li>
                <ConfigAwareLink
                  href={`/runtime_apis/${runtimeApi.name}#${method}`}
                >
                  {method}
                </ConfigAwareLink>
              </li>
            ))}
          </ul>
        </>
      ))}
    </>
  );
};
