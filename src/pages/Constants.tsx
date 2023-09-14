import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import {
  AppState,
  CallContent,
  ConstantContent,
  appState,
} from "../state/app_state";
import { JSX } from "solid-js";
import { marked } from "marked";
import { CodeComponent } from "../components/CodeComponent";
import { DocsComponent } from "../components/DocsComponent";
export const ConstantsPage = () => {
  let params = useParams<{ pallet: string }>();
  return (
    <MdBookWrapper>
      {constantsPageContent(appState(), params.pallet)}
    </MdBookWrapper>
  );
};

function constantsPageContent(
  state: AppState | undefined,
  pallet_name: string
): JSX.Element {
  let constants = state?.palletConstants(pallet_name);
  console.log("calls", state, pallet_name, constants);
  if (constants === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>{pallet_name} Pallet: Constants</h1>
      There are {constants.length} calls available on the {pallet_name} Pallet.
      {constants.map((call) => constantContent(call))}
    </>
  );
}

function constantContent(constant: ConstantContent): JSX.Element {
  return (
    <>
      <h2>{constant.name}</h2>
      {/* <div> {JSON.stringify(call.docs)}</div> */}
      <DocsComponent mdDocs={constant.docs}></DocsComponent>
      <div>
        Value type: <br />
        <code class="text-orange-500">{constant.value_type}</code>
      </div>
      <div>
        Value: <br />
        <code class="text-orange-500">{constant.value}</code>
      </div>

      <h4>Static Code example:</h4>
      <CodeComponent code={constant.code_example_static}></CodeComponent>
      <h4>Dynamic Code example:</h4>
      <CodeComponent code={constant.code_example_dynamic}></CodeComponent>
    </>
  );
}
