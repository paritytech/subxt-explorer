import { Component, JSX } from "solid-js";
import { highlight } from "./Code";
import { NameAndType } from "../state/app_state";
export interface Props {
  keyTypes?: KeyTypesSection;
  valueType?: ValueTypeSection;
  value?: ValueSection;
}

interface KeyTypesSection {
  title?: string;
  types:
    | { tag: "unnamed"; types: string[] }
    | { tag: "named"; types: NameAndType[] };
}

interface ValueTypeSection {
  title?: string;
  type: string;
}

interface ValueSection {
  title?: string;
  value: string;
}
export const KeyValueTypesLayout: Component<Props> = (props: Props) => {
  let keyTypesElement: JSX.Element;
  if (props.keyTypes !== undefined) {
    switch (props.keyTypes.types.tag) {
      case "unnamed":
        keyTypesElement = props.keyTypes.types.types.map((type) =>
          typeDisplay(type)
        );
        break;
      case "named":
        keyTypesElement = props.keyTypes.types.types.map((type) =>
          typeDisplay(type.type_path, type.name)
        );
        break;
    }
  }

  return (
    <>
      {props.keyTypes && (
        <div>
          {sectionHeading(props.keyTypes.title || "Key Type")}
          {keyTypesElement && (
            <table class="mx-0 my-8">
              <tbody>{keyTypesElement}</tbody>
            </table>
          )}
        </div>
      )}
      {props.valueType && (
        <div>
          {sectionHeading(props.valueType.title || "Value Type")}
          <table class="mx-0 my-8">
            <tbody>{typeDisplay(props.valueType.type)}</tbody>
          </table>
        </div>
      )}
      {props.value && (
        <div>
          {sectionHeading(props.value.title || "Value")}
          <table class="mx-0 my-8">
            <tbody>{typeDisplay(props.value.value)}</tbody>
          </table>
        </div>
      )}
    </>
  );
};

export function sectionHeading(title: string): JSX.Element {
  return (
    <h4 style={{}} class="mt-0 mb-1">
      {title}
    </h4>
  );
}

function typeDisplay(type: string, name?: string): JSX.Element {
  return (
    <tr>
      {name && <td class="align-top">{name} </td>}
      <td>
        <div class="text-blue-400 hljs-class font-mono whitespace-pre-wrap h-min">
          <code class="p-0">{type}</code>
        </div>
      </td>
    </tr>
  );
}
