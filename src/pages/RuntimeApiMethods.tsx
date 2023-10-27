import { useParams } from "@solidjs/router";
import { RuntimeApiMethodContent, client } from "../state/client";
import { JSX } from "solid-js";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
import { RedirectToHome } from "../components/RedirectToHome";

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
      {props().methods!.map((method) => methodContent(method))}
    </>
  );
};

function methodContent(method: RuntimeApiMethodContent): JSX.Element {
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
          title: "API Call Return Type",
          type_description: method.value_type,
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
