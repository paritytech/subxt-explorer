import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import {
  AppState,
  RuntimeApiMethodContent,
  appState,
} from "../state/app_state";
import { JSX } from "solid-js";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";

export const RuntimeApiMethodsPage = () => {
  let params = useParams<{ runtime_api: string }>();
  return (
    <MdBookWrapper>
      {callsPageContent(appState(), params.runtime_api)}
    </MdBookWrapper>
  );
};

function callsPageContent(
  state: AppState | undefined,
  runtimeApiName: string
): JSX.Element {
  let docs = state?.runtimeApiDocs(runtimeApiName);
  let methods = state?.runtimeApiMethods(runtimeApiName);
  if (docs === undefined || methods === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>Runtime API: {runtimeApiName}</h1>
      {docs && <Docs mdDocs={docs} />}
      There are {methods.length} methods available on the {runtimeApiName}{" "}
      Runtime API.
      {methods.map((method) => methodContent(method))}
    </>
  );
}

function methodContent(method: RuntimeApiMethodContent): JSX.Element {
  return (
    <>
      <h2>{method.method_name}</h2>
      <Docs mdDocs={method.docs} />
      <KeyValueTypesLayout
        keyTypes={{
          title: "API Call Arguments",
          types: {
            tag: "named",
            types: method.input_types,
          },
        }}
        valueType={{
          title: "API Call Return Type",
          type: method.value_type,
        }}
      ></KeyValueTypesLayout>
      <div class="mt-5">
        <CodeTabLayout
          staticCode={method.code_example_static}
          dynamicCode={method.code_example_dynamic}
        ></CodeTabLayout>
      </div>
    </>
  );
}
