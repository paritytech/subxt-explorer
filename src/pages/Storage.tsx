import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, StorageEntryContent, appState } from "../state/app_state";
import { JSX, Show, createSignal } from "solid-js";
import { marked } from "marked";
import { Code } from "../components/Code";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import {
  KeyValueTypesLayout,
  sectionHeading,
} from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
export const StoragePage = () => {
  let pallet = useParams<{ pallet: string }>().pallet;
  let entries = appState()?.palletStorageEntries(pallet);
  if (entries === undefined) {
    return <Navigate href={"/"} />;
  } else {
    return (
      <>
        <h1>{pallet} Pallet: Storage Entries</h1>
        There are {entries.length} storage entries on the {pallet} Pallet.
        {entries.map((entry) => storageEntryContent(appState()!, entry))}
      </>
    );
  }
};

// undefined for storage entries that require keys to be fetched.
type StorageValueState =
  | undefined
  | { tag: "loading" }
  | { tag: "error" }
  | { tag: "value"; value: string };

function storageEntryContent(
  state: AppState,
  entry: StorageEntryContent
): JSX.Element {
  let [storageValue, setStorageValue] = createSignal<StorageValueState>();

  async function fetchStorageValue() {
    setStorageValue({ tag: "loading" });
    const result = await state.fetchKeylessStorageValue(
      entry.pallet_name,
      entry.name
    );
    if (result !== undefined) {
      setStorageValue({ tag: "value", value: result });
    } else {
      setStorageValue({ tag: "error" });
    }
  }
  // fetch the value in storage when the component is loaded
  if (entry.key_types.length === 0 && state.source.tag == "url") {
    fetchStorageValue();
  }

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
        <Show
          when={entry.key_types.length === 0 && storageValue() !== undefined}
        >
          <div class="flex justify-between">
            {sectionHeading("Value")}
            <button
              onClick={fetchStorageValue}
              class={`btn py-0  ${
                storageValue()?.tag === "loading" && "disabled"
              }`}
            >
              <span class={`fa fa-repeat mr-2`}></span> Reload Value
            </button>
          </div>

          <table class="mx-0 my-8 w-full">
            <tbody>
              <tr class="w-full">
                <td>
                  <div>
                    <Show when={storageValue()?.tag === "loading"}>
                      <i class="fa fa-spinner animate-spin"></i> Loading...
                    </Show>
                    <Show when={storageValue()?.tag === "error"}>
                      <div class="font-mono whitespace-pre-wrap h-min">
                        <code class="p-0">None</code>
                      </div>
                    </Show>
                    <Show when={storageValue()?.tag === "value"}>
                      <div class="text-pink-500 hljs-class font-mono whitespace-pre-wrap h-min max-h-code overflow-scroll">
                        <code class="p-0">
                          {
                            (storageValue() as { tag: "value"; value: string })
                              .value
                          }
                        </code>
                      </div>
                    </Show>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
