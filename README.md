# Subxt Explorer

An SPA for exploring metadata of substrate based blockchains in the Browser.
Uses (Subxt)[https://github.com/paritytech/subxt] in WASM to connect to nodes, fetch storage values and generate example code snippets of how to interact with the chain using Subxt.

### How to build this project:

Prerequisites:

- node.js
- rust + cargo (nightly)
- wasm-pack

```sh
# build the wasm module
cd codegen
wasm-pack build --no-default-features --features web
cd ..

# run the frontend
npm install
npm run dev
```
