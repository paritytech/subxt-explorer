import { JSX, createSignal } from "solid-js";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import rust from "highlight.js/lib/languages/rust";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("rust", rust);

function highlight(code: string): string {
  return hljs.highlight(code, {
    language: "rust",
  }).value;
}

/**
 * Cheap hack to show only important code. Should probably replaced with something more solid later. Slices a code snippet into 3 segments:
 *
 * Boring:
 * use std::mem::take;
 * pub fn main() {
 *
 * Interesting:
 * let mut e : Option<u8> = Some(42);
 * let f = e.take();
 *
 * Boring:
 * }
 *
 *
 * Assumptions: code should be rust formatted.
 */
function sliceCodeIntoBoringInterestingBoring(
  code: string
): [string, string, string] | undefined {
  const lines = code.split("\n");

  // find `fn main`:
  let fn_main_idx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("fn main(")) {
      fn_main_idx = i;
      break;
    }
  }

  // find last curly closing bracket:
  let fn_main_close_idx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes("}")) {
      fn_main_close_idx = i;
      break;
    }
  }

  if (
    fn_main_close_idx === -1 ||
    fn_main_idx === -1 ||
    fn_main_idx + 1 >= fn_main_close_idx
  ) {
    return undefined;
  }

  return [
    lines.slice(0, fn_main_idx + 1).join("\n"),
    lines.slice(fn_main_idx + 1, fn_main_close_idx).join("\n"),
    lines.slice(fn_main_close_idx).join("\n"),
  ];
}
function highlightCodeAsBoringInterestingBoring(
  codeSegments: [string, string, string]
): string {
  return `<span class="boring">${highlight(
    codeSegments[0]
  )}</span>\n${highlight(codeSegments[1])}\n<span class="boring">${highlight(
    codeSegments[2]
  )}</span>`;
}

export const CodeComponent = ({ code }: { code: string }): JSX.Element => {
  const [showBoring, setShowBoring] = createSignal<boolean>(false);

  let codeSegments = sliceCodeIntoBoringInterestingBoring(code);

  let highlightedWithBoring: string;
  let highlightedNoBoring: string;

  if (codeSegments !== undefined) {
    highlightedWithBoring =
      highlightCodeAsBoringInterestingBoring(codeSegments);
    highlightedNoBoring = highlight(codeSegments[1]);
  } else {
    highlightedWithBoring = highlight(code);
    highlightedNoBoring = highlightedWithBoring;
  }

  let highlightedCode = () =>
    showBoring() ? highlightedWithBoring : highlightedNoBoring;

  return (
    <pre>
      <pre class="playground">
        <div class="buttons">
          <button
            class="fa fa-copy clip-button"
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
            onClick={() => {
              let codeToCopy: string;
              if (codeSegments !== undefined && !showBoring()) {
                codeToCopy = codeSegments[1];
              } else {
                codeToCopy = code;
              }
              navigator.clipboard.writeText(codeToCopy);
              console.log("Code copied to clipboard:", codeToCopy);
            }}
          >
            <i class="tooltiptext"></i>
          </button>
          {/* 
          Not used right now, can be activated later.
          
          <button
            class="fa fa-play play-button"
            title="Run this code"
            aria-label="Run this code"
          ></button> */}
          <button
            class={showBoring() ? "fa fa-eye-slash" : "fa fa-eye"}
            title="Show hidden lines"
            aria-label={showBoring() ? "Hide lines" : "Show hidden lines"}
            onClick={() => setShowBoring((old) => !old)}
          ></button>
        </div>
        <code class={`language-rust hljs`} innerHTML={highlightedCode()}></code>
      </pre>
    </pre>
  );
};
