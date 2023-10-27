import { useParams } from "@solidjs/router";
import { CallContent, client } from "../state/client";
import { JSX } from "solid-js";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
import { RedirectToHome } from "../components/RedirectToHome";
export const CallsPage = () => {
  const props = () => {
    const pallet = useParams<{ pallet: string }>().pallet;
    const calls = client()?.palletCalls(pallet);
    return {
      pallet,
      calls,
    };
  };

  if (props().calls === undefined) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>{props().pallet} Pallet: Calls</h1>
      There are {props().calls!.length} calls available on the {props().pallet}{" "}
      Pallet.
      {props().calls!.map(callContent)}
    </>
  );
};

function callContent(call: CallContent, index: number): JSX.Element {
  return (
    <>
      <AnchoredH2 title={call.name}>
        <span class="text-gray-500 text-xl float-right mt-5">
          {" "}
          index = {index}
        </span>
      </AnchoredH2>
      <Docs mdDocs={call.docs}></Docs>
      <KeyValueTypesLayout
        keyTypes={
          call.argument_types.length > 0
            ? {
                title: "Call Arguments",
                types: {
                  tag: "named",
                  types: call.argument_types,
                },
              }
            : undefined
        }
      ></KeyValueTypesLayout>
      <div class="mt-5">
        <CodeTabLayout
          staticCode={call.code_example_static}
          dynamicCode={call.code_example_dynamic}
        ></CodeTabLayout>
      </div>
    </>
  );
}
