//! This example shows how to generate all call, storage, constant and runtime api example from the `polkadot.scale` metadata file found in the artifacts directory.

use std::fs;
use subxt_example_codegen::ExampleGenerator;

fn main() -> anyhow::Result<()> {
    let example_gen = ExampleGenerator::new_from_metadata_file("artifacts/polkadot.scale")?;
    let tokens = example_gen.all_examples_wrapped()?;
    let syn_tree = syn::parse_file(&tokens.to_string()).unwrap();
    let pretty = prettyplease::unparse(&syn_tree);
    fs::write("artifacts/polkadot.rs", pretty)?;
    Ok(())
}
