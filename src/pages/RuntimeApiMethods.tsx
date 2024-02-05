import { useParams } from "@solidjs/router";
import { Client, RuntimeApiMethodContent, client } from "../state/client";
import { JSX, Show } from "solid-js";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
import { RedirectToHome } from "../components/RedirectToHome";
import {
  FetchError,
  FetchableValue,
  ValueFetched,
} from "../components/FetchableValue";

export const RuntimeApiMethodsPage = () => {
  const props = () => {
    const runtimeApi = useParams<{ runtime_api: string }>().runtime_api;
    const docs = client()?.runtimeApiDocs(runtimeApi);
    const methods = client()?.runtimeApiMethods(runtimeApi);
    return {
      runtimeApi,
      docs,
      methods,
    };
  };

  if (props().docs === undefined || props().methods === undefined) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>Runtime API: {props().runtimeApi}</h1>
      {props().docs && <Docs mdDocs={props().docs!} />}
      There are {props().methods!.length} methods available on the{" "}
      {props().runtimeApi} Runtime API.
      {props().methods!.map((method) => methodContent(client()!, method))}
    </>
  );
};

function methodContent(
  client: Client,
  method: RuntimeApiMethodContent
): JSX.Element {
  // Note: can currently only fetch keyless storage values.
  async function callRuntimeApiMethod(): Promise<FetchError | ValueFetched> {
    const value = await client.fetchKeylessRuntimeApiValue(
      method.api_name,
      method.method_name
    );
    if (value !== undefined) {
      return { tag: "value", value };
    } else {
      return { tag: "error", error: "Error executing the Runtime API Call" };
    }
  }

  const shouldFetchValue =
    method.input_types.length === 0 && client.hasOnlineCapabilities();

  return (
    <>
      <AnchoredH2 title={method.method_name}></AnchoredH2>
      <Docs mdDocs={method.docs} />
      <KeyValueTypesLayout
        keyTypes={
          method.input_types.length > 0
            ? {
                title: "API Call Arguments",
                types: {
                  tag: "named",
                  types: method.input_types,
                },
              }
            : undefined
        }
        valueType={{
          title: "Return Type",
          type_description: method.value_type,
        }}
      ></KeyValueTypesLayout>
      <Show when={shouldFetchValue}>
        <FetchableValue
          title="Returned Value"
          fetch={callRuntimeApiMethod}
          fetch_on_init={true}
        ></FetchableValue>
      </Show>
      <div class="mt-5">
        <CodeTabLayout
          staticCode={method.code_example_static}
          dynamicCode={method.code_example_dynamic}
        ></CodeTabLayout>
      </div>
    </>
  );
}
