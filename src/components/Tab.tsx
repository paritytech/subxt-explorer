import { JSX } from "solid-js";

export interface Props {
  title: string;
  active: () => boolean;
  onClick: () => void;
  icon: `fa-${string}`;
}

export const Tab = (props: Props): JSX.Element => {
  return (
    <button
      class={`font-bold border-none rounded-md px-4 py-2 mr-4  ${
        props.active() ? "bg-teal-600" : "bg-zinc-dark hover:bg-zinc-600"
      }`}
      onClick={props.onClick}
    >
      <span class={`fa ${props.icon} mr-2`}></span> {props.title}
    </button>
  );
};
