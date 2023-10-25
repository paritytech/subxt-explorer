import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import {
  ClientWrapper,
  CallContent,
  EventContent,
  clientWrapper,
} from "../state/client_wrapper";
import { JSX } from "solid-js";
import { marked } from "marked";
import { Code } from "../components/Code";
import { Docs } from "../components/Docs";
import { CodeTabLayout } from "../components/CodeTabLayout";
import { KeyValueTypesLayout } from "../components/KeyValueTypesLayout";
import { AnchoredH2 } from "../components/AnchoredH2";

export const EventsPage = () => {
  let props = () => {
    let pallet = useParams<{ pallet: string }>().pallet;
    let events = clientWrapper()?.palletEvents(pallet);
    return {
      pallet,
      events,
    };
  };

  if (props().events === undefined) {
    return <Navigate href={"/"} />;
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
