import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, CallContent, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { marked } from "marked";
import { Code } from "../components/Code";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
export const CallsPage = () => {
  let props = () => {
    let pallet = useParams<{ pallet: string }>().pallet;
    let calls = appState()?.palletCalls(pallet);
    return {
      pallet,
      calls,
    };
  };

  if (props().calls === undefined) {
    return <Navigate href={"/"} />;
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

function callContent(call: CallContent): JSX.Element {
  return (
    <>
      <AnchoredH2 title={call.name}></AnchoredH2>
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
