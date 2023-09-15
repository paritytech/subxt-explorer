import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, CallContent, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { marked } from "marked";
import { Code } from "../components/Code";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
export const CallsPage = () => {
  let params = useParams<{ pallet: string }>();
  return (
    <MdBookWrapper>{callsPageContent(appState(), params.pallet)}</MdBookWrapper>
  );
};

function callsPageContent(
  state: AppState | undefined,
  pallet_name: string
): JSX.Element {
  let calls = state?.palletCalls(pallet_name);
  if (calls === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>{pallet_name} Pallet: Calls</h1>
      There are {calls.length} calls available on the {pallet_name} Pallet.
      {calls.map((call) => callContent(call))}
    </>
  );
}

function callContent(call: CallContent): JSX.Element {
  return (
    <>
      <h2>{call.name}</h2>
      {/* <div> {JSON.stringify(call.docs)}</div> */}
      <Docs mdDocs={call.docs}></Docs>

      <div class="mt-5">
        <CodeTabLayout
          staticCode={call.code_example_static}
          dynamicCode={call.code_example_dynamic}
        ></CodeTabLayout>
      </div>
    </>
  );
}
