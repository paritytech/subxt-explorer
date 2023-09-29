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
import { AnchoredH2 } from "../components/AnchoredH2";
export const ConstantsPage = () => {
  let pallet = useParams<{ pallet: string }>().pallet;
  let constants = appState()?.palletConstants(pallet);
  if (constants === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>{pallet} Pallet: Constants</h1>
      There are {constants.length} calls available on the {pallet} Pallet.
      {constants.map(constantContent)}
    </>
  );
};

function constantContent(constant: ConstantContent): JSX.Element {
  return (
    <>
      <AnchoredH2 title={constant.name}></AnchoredH2>
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
