/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";

// body container is a special id used for styling in md-book
const root = document.getElementById("body-container");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <App />, root!);
