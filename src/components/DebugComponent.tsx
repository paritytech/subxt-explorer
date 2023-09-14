import { JSX } from "solid-js";
import { CodeComponent } from "./CodeComponent";

const CODE_EXAMPLE = `use std::mem::transmute;
pub fn main() {
    let i = transmute::<u32,u64>(4);
}
`;

export const DebugComponent = (): JSX.Element => {
  return (
    <>
      <CodeComponent code={CODE_EXAMPLE}></CodeComponent>

      <h1>=======</h1>
      <pre>
        <pre class="playground">
          <div class="buttons">
            <button
              class="fa fa-copy clip-button"
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
            >
              <i class="tooltiptext"></i>
            </button>
            <button
              class="fa fa-play play-button"
              title="Run this code"
              aria-label="Run this code"
            ></button>
            <button
              class="fa fa-eye"
              title="Show hidden lines"
              aria-label="Show hidden lines"
            ></button>
          </div>
          <code class="language-rust hljs hide-boring">
            <span class="boring">
              <span class="hljs-keyword">use</span> std::mem::transmute;
              {"\n"}
            </span>
            <span class="boring">
              <span class="hljs-keyword">pub</span>{" "}
              <span class="hljs-function">
                <span class="hljs-keyword">fn</span>{" "}
                <span class="hljs-title">main</span>
              </span>
              {`() { \n`}
            </span>
            <span class="hljs-keyword">let</span> i = transmute::&lt;
            <span class="hljs-built_in">u32</span>,
            <span class="hljs-built_in">u64</span>&gt;(
            <span class="hljs-number">4</span>);
            <span class="boring">{`\n}`}</span>
          </code>
        </pre>
      </pre>
    </>
  );
};
