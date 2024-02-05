import { Show, createSignal } from "solid-js";
import { sectionHeading } from "./KeyValueTypesLayout";

export type Props = {
  title: string;
  fetch: () => Promise<FetchError | ValueFetched>;
  fetch_on_init: boolean;
};

type Loading = {
  tag: "loading";
};
export type FetchError = {
  tag: "error";
  error: string;
};
export type ValueFetched = {
  tag: "value";
  value: string;
};

type FetchState = Loading | FetchError | ValueFetched;

export const FetchableValue = (props: Props) => {
  const [state, setState] = createSignal<FetchState>({
    tag: "loading",
  });

  const fetchState = async () => {
    setState({ tag: "loading" });
    const res = await props.fetch();
    setState(res);
  };

  if (props.fetch_on_init) {
    fetchState();
  }

  return (
    <>
      <div class="flex justify-between">
        {sectionHeading(props.title)}
        <button
          onClick={fetchState}
          class={`btn py-0  ${state()?.tag === "loading" && "disabled"}`}
        >
          <span class={`fa fa-repeat mr-2`}></span> Reload Value
        </button>
      </div>

      <table class="mx-0 my-8 w-full">
        <tbody>
          <tr class="w-full">
            <td>
              <div>
                <Show when={state()?.tag === "loading"}>
                  <i class="fa fa-spinner animate-spin"></i> Loading...
                </Show>
                <Show when={state()?.tag === "error"}>
                  <div class="font-mono whitespace-pre-wrap h-min">
                    <code class="p-0 text-red-300">
                      An Error Occurred: {(state() as FetchError).error}
                    </code>
                  </div>
                </Show>
                <Show when={state()?.tag === "value"}>
                  <div class="text-pink-500 hljs-class font-mono whitespace-pre-wrap h-min max-h-code overflow-scroll">
                    <code class="p-0">{(state() as ValueFetched).value}</code>
                  </div>
                </Show>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
