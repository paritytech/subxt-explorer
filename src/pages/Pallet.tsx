import { A, Link, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, PalletContent, appState } from "../state/app_state";
import { For, JSX } from "solid-js";
import {
  findInSidebarItems,
  setActiveItem,
  sidebarItems,
} from "../state/sidebar";
import { TryToLink } from "../components/TryLinkTo";
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
          <TryToLink href={`/pallets/${pallet_name}/calls`}>
            <h2 class="mt-12" style={{ "text-decoration": "none" }}>
              Calls
            </h2>
          </TryToLink>
          <ul>
            {content!.calls.map((call_name) => (
              <li class="text-gray-300 hover:text-pink-500">
                <TryToLink href={`/pallets/${pallet_name}/calls#${call_name}`}>
                  {call_name}
                </TryToLink>
              </li>
            ))}
          </ul>
        </>
      )}
      {content!.storage_entries.length > 0 && (
        <>
          <TryToLink href={`/pallets/${pallet_name}/storage_entries`}>
            <h2 class="mt-12">Storage Entries</h2>
          </TryToLink>
          <ul>
            {content!.storage_entries.map((entry_name) => (
              <li class="text-gray-300 hover:text-pink-500">
                <TryToLink
                  href={`/pallets/${pallet_name}/storage_entries#${entry_name}`}
                >
                  {entry_name}
                </TryToLink>
              </li>
            ))}
          </ul>
        </>
      )}
      {content!.constants.length > 0 && (
        <>
          <TryToLink href={`/pallets/${pallet_name}/sto`}>
            <h2 class="mt-12 text-gray-300 hover:text-pink-500">Constants</h2>
          </TryToLink>
          <ul>
            {content!.constants.map((constant) => (
              <li class="text-gray-300 hover:text-pink-500">
                <TryToLink href={`/pallets/${pallet_name}/constants`}>
                  {constant}
                </TryToLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
