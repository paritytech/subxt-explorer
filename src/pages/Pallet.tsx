import { A, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, PalletContent, appState } from "../state/app_state";
import { For, JSX } from "solid-js";
export const PalletPage = () => {
  let params = useParams<{ pallet: string }>();
  return (
    <MdBookWrapper>
      {palletPageContent(appState(), params.pallet)}
    </MdBookWrapper>
  );
};

function palletPageContent(
  state: AppState | undefined,
  pallet_name: string
): JSX.Element {
  let docs = state?.palletDocs(pallet_name);
  let content = state?.palletContent(pallet_name);
  if (docs === undefined || console === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>
        <span class="">{pallet_name}</span> Pallet
      </h1>
      There is no Documentation available for the System Pallet.
      {/* TODO: Right now no calls are available {JSON.stringify(docs)} */}
      {content!.calls.length > 0 && (
        <>
          <A href={`/pallets/${pallet_name}/calls`}>
            <h2 style={{ "margin-top": "16px" }}>Calls</h2>
          </A>
          <ul>
            {content!.calls.map((call_name) => (
              <li>
                <A
                  href={`/pallets/${pallet_name}/calls#${call_name}`}
                  class="no-"
                >
                  {call_name}
                </A>
              </li>
            ))}
          </ul>
        </>
      )}
      {content!.storage_entries.length > 0 && (
        <>
          <A href={`/pallets/${pallet_name}/storage_entries`}>
            <h2 style={{ "margin-top": "16px" }}>Storage Entries</h2>
          </A>
          <ul>
            {content!.storage_entries.map((entry_name) => (
              <li>
                <A
                  href={`/pallets/${pallet_name}/storage_entries#${entry_name}`}
                >
                  {entry_name}
                </A>
              </li>
            ))}
          </ul>
        </>
      )}
      {content!.constants.length > 0 && (
        <>
          <A href={`/pallets/${pallet_name}/sto`}>
            <h2 style={{ "margin-top": "16px" }}>Constants</h2>
          </A>
          <ul>
            {content!.constants.map((constant) => (
              <li>
                <A href={`/pallets/${pallet_name}/constants`}>{constant}</A>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
