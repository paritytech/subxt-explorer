import { useParams } from "@solidjs/router";
import { ConstantContent, client } from "../state/client";
import { JSX } from "solid-js";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
import { RedirectToHome } from "../components/RedirectToHome";
export const ConstantsPage = () => {
  const props = () => {
    const pallet = useParams<{ pallet: string }>().pallet;
    const constants = client()?.palletConstants(pallet);
    return {
      pallet,
      constants,
    };
  };

  if (props().constants === undefined) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>{props().pallet} Pallet: Constants</h1>
      There are {props().constants!.length} calls available on the{" "}
      {props().pallet} Pallet.
      {props().constants!.map(constantContent)}
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
