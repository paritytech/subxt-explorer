use std::fs;

use subxt_example_codegen::ExampleGenerator;

/// Make sure you have a `polkadot.scale` file at the root of this project.
///
/// Use `cargo run` to just generate a file with all examples for `polkadot.scale` under `gen/generated.rs`.
/// You can copy this file into the empty `src/generated.rs` to have it included in the module tree and checked by rust analyzer.
fn main() -> anyhow::Result<()> {
    let example_gen = ExampleGenerator::new_from_metadata_file("polkadot.scale")?;
    let tokens = example_gen.all_examples_wrapped()?;
    let syn_tree = syn::parse_file(&tokens.to_string()).unwrap();
    let pretty = prettyplease::unparse(&syn_tree);
    fs::write("gen/generated.rs", pretty)?;
    Ok(())
}
