import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  // root: "./src_html/",
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    wasm(),
    topLevelAwait(),
    solidPlugin(),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: "esnext",
    rollupOptions: {
      external: ["subxt_example_codegen"],
    },
  },
});
