# Auto-Generated Subxt Code Examples

Note: This is a Prototype / Proof of Concept

This crate exposes a struct `ExampleGenerator` that is capable of generating code examples for calls, constants and storage entries from static metadata.
The generated code can look like this:

```rust,norun
#[subxt::subxt(runtime_metadata_path = "polkadot.scale")]
pub mod polkadot {}
use polkadot::runtime_types;
use subxt::{OnlineClient, PolkadotConfig};
use subxt_signer::sr25519::dev;
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let dest: ::subxt::utils::MultiAddress<::subxt::utils::AccountId32, ()> =
        ::subxt::utils::MultiAddress::Id(::subxt::utils::AccountId32([8; 32usize]));
    let value: ::core::primitive::u128 = 128;
    let payload = polkadot::tx().balances().transfer(dest, value);
    let api = OnlineClient::<PolkadotConfig>::new().await?;
    let from = dev::alice();
    let events = api
        .tx()
        .sign_and_submit_then_watch_default(&payload, &from)
        .await?
        .wait_for_finalized_success()
        .await?;
    Ok(())
}
```

## Todo / Missing

- [x] static calls
- [x] static storage queries
- [x] static constant queries
- [ ] static custom value queries
- [x] generate code for dynamic calls / queries
- [x] allow a custom file/url intead of `polkadot.scale`
- [x] special treatment of certain types when generating examples e.g AccountId32 can use `subxt_signer::sr25519::dev::alice().public_key()`
- [x] shorten `std`/`core`/`alloc` type paths in examples. Noone wants to see `::core::primitive::u128`, `u128` should suffice.

## How to build:

### Web

```
wasm-pack build --dev --no-default-features --features web
```

(without the `--dev` flag, wasm-opt will take about 2 minutes, which is annoying.)

### Native

```
cargo run --no-default-features --features native --target=x86_64-unknown-linux-gnu
```
