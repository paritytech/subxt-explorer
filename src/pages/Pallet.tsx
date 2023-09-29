import { A, Link, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, PalletContent, appState } from "../state/app_state";
import { For, JSX } from "solid-js";
import {
  findInSidebarItems,
  setActiveItem,
  sidebarItems,
} from "../state/sidebar_state";
import { TryToLink } from "../components/TryLinkTo";
export const PalletPage = () => {
  let pallet = useParams<{ pallet: string }>().pallet;
  let docs = appState()?.palletDocs(pallet);
  let content = appState()?.palletContent(pallet);
  if (docs === undefined || console === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>
        <span class="">{pallet}</span> Pallet
      </h1>
      There is no Documentation available for the System Pallet.
      {content!.calls.length > 0 && (
        <PalletItemSection
          title="Calls"
          titleHref={`/pallets/${pallet}/calls`}
          items={content!.calls}
          itemToHref={(e) => `/pallets/${pallet}/calls#${e}`}
        ></PalletItemSection>
      )}
      {content!.storage_entries.length > 0 && (
        <PalletItemSection
          title="Storage Entries"
          titleHref={`/pallets/${pallet}/storage_entries`}
          items={content!.storage_entries}
          itemToHref={(e) => `/pallets/${pallet}/storage_entries#${e}`}
        ></PalletItemSection>
      )}
      {content!.constants.length > 0 && (
        <PalletItemSection
          title="Constants"
          titleHref={`/pallets/${pallet}/constants`}
          items={content!.constants}
          itemToHref={(e) => `/pallets/${pallet}/constants#${e}`}
        ></PalletItemSection>
      )}
      {content!.events.length > 0 && (
        <PalletItemSection
          title="Events"
          titleHref={`/pallets/${pallet}/events`}
          items={content!.events}
          itemToHref={(e) => `/pallets/${pallet}/events#${e}`}
        ></PalletItemSection>
      )}
    </>
  );
};

type PalletItemSectionProps = {
  title: string;
  titleHref: string;
  items: string[];
  itemToHref: (item: string) => string;
};

function PalletItemSection(props: PalletItemSectionProps): JSX.Element {
  return (
    <>
      <TryToLink href={props.titleHref}>
        <h2 class="mt-12 text-gray-300 hover:text-pink-500">{props.title}</h2>
      </TryToLink>
      <ul>
        {props.items.map((item) => (
          <li class="text-gray-300 hover:text-pink-500">
            <TryToLink href={props.itemToHref(item)}>{item}</TryToLink>
          </li>
        ))}
      </ul>
    </>
  );
}
