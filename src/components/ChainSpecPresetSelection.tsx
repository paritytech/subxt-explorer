import { Accessor, JSX, Match, Switch, createSignal, onMount } from "solid-js";
import { ChainSpec, ChainSpecService } from "../services/chain_spec_service";

type ChainSpecsFetchingState =
  | { tag: "success"; specs: ChainSpec[] }
  | { tag: "loading" }
  | { tag: "error"; error: string };

export const ChainSpecPresetSelection = (props: {
  onChainSpecPresetSelected: (chainSpec: ChainSpec) => void;
  selectedSpecName: Accessor<string | undefined>;
}): JSX.Element => {
  const [chainSpecs, setChainSpecs] = createSignal<ChainSpecsFetchingState>({
    tag: "loading",
  });

  onMount(async () => {
    try {
      const specs = await ChainSpecService.instance.fetchChainSpecs();
      setChainSpecs({ tag: "success", specs });
    } catch (ex: any) {
      setChainSpecs({ tag: "error", error: ex.toString() });
    }
  });

  return (
    <Switch>
      <Match when={chainSpecs().tag === "loading"}>
        <div class="text-center w-full mb-4">
          {" "}
          <i class="fa fa-spinner animate-spin"></i> Loading chain spec
          presets...
        </div>
      </Match>
      <Match when={chainSpecs().tag === "success"}>
        <div class="flex align-middle w-full justify-around">
          {(chainSpecs() as { tag: "success"; specs: ChainSpec[] }).specs.map(
            (e) => (
              <div class="flex align-middle">
                <input
                  class={`appearance-none w-7 h-7 rounded-full cursor-pointer border-solid border-2 ${
                    props.selectedSpecName() == e.name
                      ? "bg-pink-500 border-white"
                      : "bg-zinc-dark border-gray-500"
                  }`}
                  type="radio"
                  id={e.name}
                  name="chainspec_preset"
                  value={e.name}
                  onClick={() => {
                    props.onChainSpecPresetSelected(e);
                  }}
                />
                <label
                  class={`pl-2 font-bold cursor-pointer ${
                    props.selectedSpecName() == e.name ? "text-white" : ""
                  }`}
                  for={e.name}
                >
                  {e.name}
                </label>
              </div>
            )
          )}
        </div>
      </Match>
      <Match when={chainSpecs().tag === "error"}>
        <div class="text-center w-full text-red-400 mb-4">
          Error while loading chain spec presets:{" "}
          {(chainSpecs() as { tag: "error"; error: string }).error}
        </div>
      </Match>
    </Switch>
  );
};
