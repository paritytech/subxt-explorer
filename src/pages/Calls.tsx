import { Navigate, useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
import { AppState, CallContent, appState } from "../state/app_state";
import { JSX } from "solid-js";
import { highlight } from "../utils";
import { marked } from "marked";
import { CodeComponent } from "../components/CodeComponent";
import { DocsComponent } from "../components/DocsComponent";
export const CallsPage = () => {
  let params = useParams<{ pallet: string }>();
  return (
    <MdBookWrapper>{callsPageContent(appState(), params.pallet)}</MdBookWrapper>
  );
};

function callsPageContent(
  state: AppState | undefined,
  pallet_name: string
): JSX.Element {
  let calls = state?.palletCalls(pallet_name);
  console.log("calls", state, pallet_name, calls);
  if (calls === undefined) {
    return <Navigate href={"/"} />;
  }
  return (
    <>
      <h1>{pallet_name} Pallet: Calls</h1>
      There are {calls.length} calls available on the {pallet_name} Pallet.
      {calls.map((call) => callContent(call))}
    </>
  );
}

function callContent(call: CallContent): JSX.Element {
  return (
    <>
      <h2>{call.call_name}</h2>
      {/* <div> {JSON.stringify(call.docs)}</div> */}
      <DocsComponent mdDocs={call.docs}></DocsComponent>
      <h4>Static Code example:</h4>
      <CodeComponent code={call.code_example_static}></CodeComponent>
      <h4>Dynamic Code example:</h4>
      <CodeComponent code={call.code_example_dynamic}></CodeComponent>
    </>
  );
}

const leptoscode = `
use leptos::*;

#[component]
pub fn SimpleCounter(initial_value: i32) -> impl IntoView {
    // create a reactive signal with the initial value
    let (value, set_value) = create_signal(initial_value);

    // create event handlers for our buttons
    let clear = move |_| set_value(0);
    let decrement = move |_| set_value.update(|value| *value -= 1);
    let increment = move |_| set_value.update(|value| *value += 1);

    // create user interfaces with the declarative view! macro
    view! {
        &lt;div&gt;
            &lt;button on:click=clear&gt;Clear&lt;/button&gt;
            &lt;button on:click=decrement&gt;-1&lt;/button&gt;
            // text nodes can be quoted or unquoted
            &lt;span&gt;&quot;Value: &quot; {value} &quot;!&quot;&lt;/span&gt;
            &lt;button on:click=increment&gt;+1&lt;/button&gt;
        &lt;/div&gt;
    }
}`;
