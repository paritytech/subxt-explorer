import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, StorageEntryContent, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { marked } from "marked";
import { CodeComponent } from "../components/CodeComponent";
import { DocsComponent } from "../components/DocsComponent";
export const StoragePage = () => {
  let params = useParams<{ pallet: string }>();
  return (
    <MdBookWrapper>
      {storagePageContent(appState(), params.pallet)}
    </MdBookWrapper>
  );
};

function storagePageContent(
  state: AppState | undefined,
  pallet_name: string
): JSX.Element {
  let entries = state?.palletStorageEntries(pallet_name);
  if (entries === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>{pallet_name} Pallet: Storage Entries</h1>
      There are {entries.length} storage entries on the {pallet_name} Pallet.
      {entries.map((entry) => storageEntryContent(entry))}
    </>
  );
}

function storageEntryContent(entry: StorageEntryContent): JSX.Element {
  return (
    <>
      <h2>{entry.name}</h2>
      {/* <div> {JSON.stringify(call.docs)}</div> */}
      <DocsComponent mdDocs={entry.docs}></DocsComponent>
      <div>
        Key Types:
        {entry.key_types.length == 0 ? (
          "None"
        ) : (
          <ul>
            {entry.key_types.map((k) => (
              <li>
                <code class="text-orange-500">{k}</code>
              </li>
            ))}
          </ul>
        )}
        <div>
          Value Type: <br />
          <code class="text-orange-500">{entry.value_type}</code>
        </div>
      </div>

      <h4>Static Code example:</h4>
      <CodeComponent code={entry.code_example_static}></CodeComponent>
      <h4>Dynamic Code example:</h4>
      <CodeComponent code={entry.code_example_dynamic}></CodeComponent>
    </>
  );
}
