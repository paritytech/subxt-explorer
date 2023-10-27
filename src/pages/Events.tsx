import { useParams } from "@solidjs/router";
import { EventContent, client } from "../state/client";
import { JSX } from "solid-js";
import { Docs } from "../components/Docs";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";
import { RedirectToHome } from "../components/RedirectToHome";

export const EventsPage = () => {
  const props = () => {
    const pallet = useParams<{ pallet: string }>().pallet;
    const events = client()?.palletEvents(pallet);
    return {
      pallet,
      events,
    };
  };

  if (props().events === undefined) {
    return <RedirectToHome />;
  }
  return (
    <>
      <h1>{props().pallet} Pallet: Events</h1>
      There are {props().events!.length} events available on the{" "}
      {props().pallet} Pallet.
      {props().events!.map(eventContent)}
    </>
  );
};

function eventContent(event: EventContent): JSX.Element {
  return (
    <>
      <AnchoredH2 title={event.name}></AnchoredH2>
      <Docs mdDocs={event.docs}></Docs>
      <KeyValueTypesLayout
        keyTypes={{
          title:
            event.field_types.length === 0
              ? "This Event has no data fields attached."
              : "Event Data",
          types: { tag: "named", types: event.field_types },
        }}
      ></KeyValueTypesLayout>
    </>
  );
}
