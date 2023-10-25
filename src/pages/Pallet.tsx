import { A, Link, Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import {
  ClientWrapper,
  PalletContent,
  clientWrapper,
} from "../state/client_wrapper";
import { For, JSX, createEffect, createSignal } from "solid-js";
import {
  activeItem,
  findInSidebarItems,
  setActiveItem,
  sidebarItems,
} from "../state/sidebar_state";
import { TryToLink } from "../components/TryLinkTo";
import { HomePageState } from "./Home";
import { RedirectToHome } from "../components/RedirectToHome";

// // refetch pallet when
// let props = () => {
//   let _a = activeItem();
//   let pallet = useParams<{ pallet: string }>().pallet;
//   let docs = appState()?.palletDocs(pallet);
//   let content = appState()?.palletContent(pallet);
//   return {
//     pallet,
//     docs,
//     content,
//   };
// };

// return <PalletPageInternal {...props()}></PalletPageInternal>;

export const PalletPage = () => {
  let props = () => {
    let pallet = useParams<{ pallet: string }>().pallet;
    return {
      docs: clientWrapper()?.palletDocs(pallet),
      content: clientWrapper()?.palletContent(pallet),
      pallet,
    };
  };
  if (props().docs === undefined || props().content === undefined) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>
        <span class="">{props().pallet}</span> Pallet
      </h1>
      There is no Documentation available for the {props().pallet} Pallet.
      {props().content!.calls.length > 0 && (
        <PalletItemSection
          title="Calls"
          titleHref={`/pallets/${props().pallet}/calls`}
          items={props().content!.calls}
          itemToHref={(e) => `/pallets/${props().pallet}/calls#${e}`}
        ></PalletItemSection>
      )}
      {props().content!.storage_entries.length > 0 && (
        <PalletItemSection
          title="Storage Entries"
          titleHref={`/pallets/${props().pallet}/storage_entries`}
          items={props().content!.storage_entries}
          itemToHref={(e) => `/pallets/${props().pallet}/storage_entries#${e}`}
        ></PalletItemSection>
      )}
      {props().content!.constants.length > 0 && (
        <PalletItemSection
          title="Constants"
          titleHref={`/pallets/${props().pallet}/constants`}
          items={props().content!.constants}
          itemToHref={(e) => `/pallets/${props().pallet}/constants#${e}`}
        ></PalletItemSection>
      )}
      {props().content!.events.length > 0 && (
        <PalletItemSection
          title="Events"
          titleHref={`/pallets/${props().pallet}/events`}
          items={props().content!.events}
          itemToHref={(e) => `/pallets/${props().pallet}/events#${e}`}
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
      <TryToLink
        href={`${
          props.titleHref
        }?${HomePageState.instance.appConfigParamString()}`}
      >
        <h2 class="mt-12 text-gray-300 hover:text-pink-500">{props.title}</h2>
      </TryToLink>
      <ul>
        <For each={props.items}>
          {(item) => (
            <li class="text-gray-300 hover:text-pink-500">
              <TryToLink
                href={`${props.itemToHref(
                  item
                )}?${HomePageState.instance.appConfigParamString()}`}
              >
                {item}
              </TryToLink>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
