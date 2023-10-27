import { Component, JSX, Show, createSignal } from "solid-js";
import { NameAndType, TypeDescription } from "../state/client";
export interface Props {
  keyTypes?: KeyTypesSection;
  valueType?: ValueTypeSection;
  value?: ValueSection;
}

interface KeyTypesSection {
  title?: string;
  types:
    | { tag: "unnamed"; types: TypeDescription[] }
    | { tag: "named"; types: NameAndType[] };
}

interface ValueTypeSection {
  title?: string;
  type_description: TypeDescription;
}

interface ValueSection {
  title?: string;
  value: string;
}

export const KeyValueTypesLayout: Component<Props> = (props: Props) => {
  const [valueTypeMode, setValueTypeMode] = createSignal<"path" | "structure">(
    "structure"
  );

  const [keyTypeMode, setKeyTypeMode] = createSignal<"path" | "structure">(
    "structure"
  );

  let keyTypes: {
    name?: string;
    type_description: TypeDescription;
  }[];
  if (props.keyTypes !== undefined) {
    switch (props.keyTypes.types.tag) {
      case "unnamed":
        keyTypes = props.keyTypes.types.types.map((type_description) => {
          return {
            type_description,
          };
        });
        break;
      case "named":
        keyTypes = props.keyTypes.types.types;
        break;
    }
  }

  return (
    <>
      {props.keyTypes && (
        <TypeDisplay
          title={props.keyTypes.title || "Key Type"}
          types={keyTypes!}
        ></TypeDisplay>
      )}

      {props.valueType && (
        <TypeDisplay
          title="Value Type"
          types={[
            {
              type_description: props.valueType.type_description,
            },
          ]}
        ></TypeDisplay>
      )}
      {props.value && (
        <div>
          {sectionHeading(props.value.title || "Value")}
          <table class="mx-0 my-8 w-full">
            <tbody>{trDisplay(props.value.value)}</tbody>
          </table>
        </div>
      )}
    </>
  );
};

function TypeDisplay(props: {
  title: string;
  types: {
    name?: string;
    type_description: TypeDescription;
  }[];
}) {
  const [typeMode, setTypeMode] = createSignal<"path" | "structure">("structure");

  return (
    <div>
      <div class="flex justify-between">
        {sectionHeading(props.title)}

        <Show
          when={props.types.some(
            (e) =>
              e.type_description.type_path != e.type_description.type_structure
          )}
        >
          <button
            onClick={() => {
              if (typeMode() === "structure") {
                setTypeMode("path");
              } else {
                setTypeMode("structure");
              }
            }}
            class="btn mb-0 py-0"
          >
            {typeMode() === "structure"
              ? "Show Type Path"
              : "Show Type Structure"}
          </button>
        </Show>
      </div>
      <table class="mx-0 my-8 w-full">
        <tbody>
          {props.types.map((e) =>
            trDisplay(
              typeMode() === "structure"
                ? e.type_description.type_structure
                : e.type_description.type_path,
              e.name
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export function sectionHeading(title: string): JSX.Element {
  return (
    <h4 style={{}} class="mt-0 mb-1">
      {title}
    </h4>
  );
}

function trDisplay(element: string, name?: string): JSX.Element {
  return (
    <tr class="w-full">
      {name && <td class="align-top">{name} </td>}
      <td>
        <div class="text-pink-500 hljs-class font-mono whitespace-pre-wrap h-min max-h-code overflow-scroll">
          <code class="p-0">{element}</code>
        </div>
      </td>
    </tr>
  );
}
