import { JSX } from "solid-js";
import { highlight } from "../utils";

export const CodeComponent = ({ code }: { code: string }): JSX.Element => {
  return (
    <pre>
      <code class="language-rs" innerHTML={highlight(`\n${code}`)}></code>
    </pre>
  );
};
