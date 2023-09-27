pub fn type_structure_description(
    type_id: u32,
    metadata: &subxt_metadata::Metadata,
) -> anyhow::Result<String> {
    Ok("This is the type description".into())
}
