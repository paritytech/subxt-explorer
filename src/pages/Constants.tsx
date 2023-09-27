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
import { Code } from "../components/Code";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
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
      <h2 class="mt-12">{constant.name}</h2>
      <Docs mdDocs={constant.docs}></Docs>
      <KeyValueTypesLayout
        valueType={{
          title: "Constant Type",
          type_description: constant.value_type,
        }}
        value={{
          title: "Constant Value",
          value: constant.value,
        }}
      ></KeyValueTypesLayout>
      <div class="mt-5">
        <CodeTabLayout
          staticCode={constant.code_example_static}
          dynamicCode={constant.code_example_dynamic}
        ></CodeTabLayout>
      </div>
    </>
  );
}
