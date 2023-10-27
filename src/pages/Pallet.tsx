import { useParams } from "@solidjs/router";
import { client } from "../state/client";
import { For, JSX } from "solid-js";

import { RedirectToHome } from "../components/RedirectToHome";
import { AppConfig } from "../state/app_config";
import { ConfigAwareLink } from "../components/ConfigAwareLink";

export const PalletPage = () => {
  const props = () => {
    const pallet = useParams<{ pallet: string }>().pallet;
    return {
      docs: client()?.palletDocs(pallet),
      content: client()?.palletContent(pallet),
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
          titleHref={AppConfig.instance.href(
            `/pallets/${props().pallet}/storage_entries`
          )()}
          items={props().content!.storage_entries}
          itemToHref={(e) =>
            AppConfig.instance.href(
              `/pallets/${props().pallet}/constants#${e}`
            )()
          }
        ></PalletItemSection>
      )}
      {props().content!.constants.length > 0 && (
        <PalletItemSection
          title="Constants"
          titleHref={AppConfig.instance.href(
            `/pallets/${props().pallet}/constants`
          )()}
          items={props().content!.constants}
          itemToHref={(e) =>
            AppConfig.instance.href(
              `/pallets/${props().pallet}/constants#${e}`
            )()
          }
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
      <ConfigAwareLink href={props.titleHref}>
        <h2 class="mt-12 text-gray-300 hover:text-pink-500">{props.title}</h2>
      </ConfigAwareLink>
      <ul>
        <For each={props.items}>
          {(item) => (
            <li class="text-gray-300 hover:text-pink-500">
              <ConfigAwareLink href={props.itemToHref(item)}>
                {item}
              </ConfigAwareLink>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
