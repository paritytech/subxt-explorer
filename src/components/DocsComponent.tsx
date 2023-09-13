import { marked } from "marked";
import { JSX } from "solid-js";

export const DocsComponent = ({
  mdDocs,
}: {
  mdDocs: string[];
}): JSX.Element => {
  return <div innerHTML={marked(mdDocs.join("\n"))}></div>;
};
