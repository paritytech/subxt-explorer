import { marked } from "marked";
import { JSX } from "solid-js";

export const Docs = ({ mdDocs }: { mdDocs: string[] }): JSX.Element => {
  let md = mdDocs
    .filter((e) => e.length != 0)
    .map((e) => e.trim())
    .join("\n")
    .trim();
  return md && <blockquote innerHTML={marked(md)}></blockquote>;
};
