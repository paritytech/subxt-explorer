import { Accessor, JSX, Match, Switch } from "solid-js";
import { ChainSpec, ChainSpecService } from "../services/chain_spec_service";

export const ChainSpecPresetSelection = (props: {
  onChainSpecPresetSelected: (chainSpec: ChainSpec) => void;
  selectedSpecName: Accessor<string | undefined>;
}): JSX.Element => {
  const chainSpecs = ChainSpecService.instance.chainSpecs;
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
                  //   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  class={`appearance-none w-7 h-7 rounded-full cursor-pointer border-solid border-2 ${
                    props.selectedSpecName() == e.name
                      ? "bg-pink-500 border-white"
                      : "bg-zinc-dark border-gray-500"
                  }`}
                  //   style={{ border: "2px solid #F472B6" }}
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
          Error: {(chainSpecs() as { tag: "error"; error: string }).error}
        </div>
      </Match>
    </Switch>
  );
};
