import { useParams } from "@solidjs/router";
import { Client, StorageEntryContent, client } from "../state/client";
import { JSX, Show } from "solid-js";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
import { RedirectToHome } from "../components/RedirectToHome";
import {
  FetchError,
  FetchableValue,
  ValueFetched,
} from "../components/FetchableValue";

export const StoragePage = () => {
  const props = () => {
    const pallet = useParams<{ pallet: string }>().pallet;
    const entries = client()?.palletStorageEntries(pallet);
    return {
      pallet,
      entries,
    };
  };

  if (props().entries === undefined) {
    return <RedirectToHome />;
  } else {
    return (
      <>
        <h1>{props().pallet} Pallet: Storage Entries</h1>
        There are {props().entries!.length} storage entries on the{" "}
        {props().pallet} Pallet.
        {props().entries!.map((entry) => storageEntryContent(client()!, entry))}
      </>
    );
  }
};

function storageEntryContent(
  client: Client,
  entry: StorageEntryContent
): JSX.Element {
  async function fetchStorageValue(): Promise<ValueFetched | FetchError> {
    const value = await client.fetchKeylessStorageValue(
      entry.pallet_name,
      entry.name
    );
    if (value !== undefined) {
      return { tag: "value", value };
    } else {
      return { tag: "error", error: "Error fetching storage value" };
    }
  }
  // fetch the value in storage when the component is loaded
  const shouldFetchValue =
    entry.key_types.length === 0 && client.hasOnlineCapabilities();

  return (
    <>
      <AnchoredH2 title={entry.name}></AnchoredH2>
      <Docs mdDocs={entry.docs}></Docs>
      <div>
        <KeyValueTypesLayout
          keyTypes={{
            title:
              entry.key_types.length == 0
                ? "No key needed for querying"
                : entry.key_types.length == 1
                ? "Key Type"
                : "Key Types",
            types: {
              tag: "unnamed",
              types: entry.key_types,
            },
          }}
          valueType={{
            title: "Value Type",
            type_description: entry.value_type,
          }}
        ></KeyValueTypesLayout>
        <Show when={shouldFetchValue}>
          <FetchableValue
            title="Value"
            fetch={fetchStorageValue}
            fetch_on_init={true}
          ></FetchableValue>
        </Show>
      </div>
      <div class="mt-5">
        <CodeTabLayout
          staticCode={entry.code_example_static}
          dynamicCode={entry.code_example_dynamic}
        ></CodeTabLayout>
      </div>
    </>
  );
}
