import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, CallContent, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { marked } from "marked";
import { CodeComponent } from "../components/CodeComponent";
import { DocsComponent } from "../components/DocsComponent";
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
  console.log("calls", state, pallet_name, calls);
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
      <DocsComponent mdDocs={call.docs}></DocsComponent>
      <h4>Static Code example:</h4>
      <CodeComponent code={call.code_example_static}></CodeComponent>
      <h4>Dynamic Code example:</h4>
      <CodeComponent code={call.code_example_dynamic}></CodeComponent>
    </>
  );
}
