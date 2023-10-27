import { render } from "solid-js/web";

import App from "./App";
import { Router, hashIntegration } from "@solidjs/router";

const root = document.getElementById("body-container");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router source={hashIntegration()}>
      <App />{" "}
    </Router>
  ),
  root!
);
