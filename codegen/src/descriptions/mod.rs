use std::collections::HashMap;

use scale_info::{
    form::PortableForm, Field, PortableRegistry, TypeDef, TypeDefArray, TypeDefBitSequence,
    TypeDefCompact, TypeDefPrimitive, TypeDefSequence, TypeDefTuple, TypeDefVariant, Variant,
};

use self::formatting::format_type_description;

pub mod formatting;

pub fn type_description_formatted(
    type_id: u32,
    metadata: &subxt_metadata::Metadata,
) -> anyhow::Result<String> {
    let mut cache = HashMap::<u32, CachedDescription>::new();
    let type_description = type_description(type_id, metadata.types(), &mut cache)?;
    let type_description = format_type_description(&type_description);
    Ok(type_description)
}

#[derive(Clone, Debug)]
enum CachedDescription {
    /// not known yet, but computation has already started
    Recursive,
    /// computation was finished
    Description(String),
}

fn type_description(
    type_id: u32,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    match cache.get(&type_id) {
        Some(CachedDescription::Recursive) => return Ok("Recursive".into()),
        Some(CachedDescription::Description(description)) => return Ok(description.clone()),
        _ => {}
    };
    cache.insert(type_id, CachedDescription::Recursive);
    let ty = registry.resolve(type_id).ok_or(anyhow::anyhow!(
        "Type with id {} not found in registry",
        type_id
    ))?;
    let ident = ty.path.ident();
    let prefix = type_def_prefix(&ty.type_def);
    let mut type_def_description = type_def_type_description(&ty.type_def, registry, cache)?;
    if let Some(ident) = ident {
        type_def_description = format!("{}{}{}", prefix, ident, type_def_description);
        cache.insert(
            type_id,
            CachedDescription::Description(format!("{prefix}{ident}")),
        );
    } else {
        cache.insert(
            type_id,
            CachedDescription::Description(type_def_description.clone()),
        );
        type_def_description = format!("{}{}", prefix, type_def_description);
    }

    // cannot avoid the clone here sadly:

    Ok(type_def_description)
}

/// todo: clean this up
fn type_def_prefix(type_def: &TypeDef<PortableForm>) -> &str {
    match type_def {
        TypeDef::Variant(_) => "enum ",
        _ => "",
    }
}

fn type_def_type_description(
    type_def: &TypeDef<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    match type_def {
        TypeDef::Composite(composite) => {
            fields_type_description(&composite.fields, registry, cache)
        }

        TypeDef::Variant(variant) => variant_type_def_type_description(variant, registry, cache),
        TypeDef::Sequence(sequence) => sequence_type_description(sequence, registry, cache),
        TypeDef::Array(array) => array_type_description(array, registry, cache),
        TypeDef::Tuple(tuple) => tuple_type_description(tuple, registry, cache),
        TypeDef::Primitive(primitive) => primitive_type_description(primitive),
        TypeDef::Compact(compact) => compact_type_description(compact, registry, cache),
        TypeDef::BitSequence(bit_sequence) => {
            bit_sequence_type_description(bit_sequence, registry, cache)
        }
    }
}

fn tuple_type_description(
    tuple: &TypeDefTuple<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let mut output = "(".to_string();
    let mut iter = tuple.fields.iter().peekable();
    while let Some(ty) = iter.next() {
        let type_description = type_description(ty.id, registry, cache)?;
        output.push_str(&type_description);
        if iter.peek().is_some() {
            output.push(',')
        }
    }
    output.push(')');
    Ok(output)
}

fn bit_sequence_type_description(
    bit_sequence: &TypeDefBitSequence<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let bit_order_type = type_description(bit_sequence.bit_order_type.id, registry, cache)?;
    let bit_store_type = type_description(bit_sequence.bit_store_type.id, registry, cache)?;
    Ok(format!("BitSequence({bit_order_type}, {bit_store_type})"))
}

fn sequence_type_description(
    sequence: &TypeDefSequence<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let type_description = type_description(sequence.type_param.id, registry, cache)?;
    Ok(format!("Vec<{type_description}>"))
}

fn compact_type_description(
    compact: &TypeDefCompact<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let type_description = type_description(compact.type_param.id, registry, cache)?;
    Ok(format!("Compact({type_description})"))
}

fn array_type_description(
    array: &TypeDefArray<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let type_description = type_description(array.type_param.id, registry, cache)?;
    Ok(format!("[{type_description}; {}]", array.len))
}

fn primitive_type_description(primitive: &TypeDefPrimitive) -> anyhow::Result<String> {
    Ok(match &primitive {
        TypeDefPrimitive::Bool => "bool",
        TypeDefPrimitive::Char => "char",
        TypeDefPrimitive::Str => "String",
        TypeDefPrimitive::U8 => "u8",
        TypeDefPrimitive::U16 => "u16",
        TypeDefPrimitive::U32 => "u32",
        TypeDefPrimitive::U64 => "u64",
        TypeDefPrimitive::U128 => "u128",
        TypeDefPrimitive::U256 => "u256",
        TypeDefPrimitive::I8 => "i8",
        TypeDefPrimitive::I16 => "i16",
        TypeDefPrimitive::I32 => "i32",
        TypeDefPrimitive::I64 => "i64",
        TypeDefPrimitive::I128 => "i128",
        TypeDefPrimitive::I256 => "i256",
    }
    .into())
}

fn variant_type_def_type_description(
    variant_type_def: &TypeDefVariant<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let mut variants_string = String::new();
    variants_string.push('{');
    let mut iter = variant_type_def.variants.iter().peekable();
    while let Some(variant) = iter.next() {
        let variant_string = variant_type_description(variant, registry, cache)?;
        variants_string.push_str(&variant_string);

        if iter.peek().is_some() {
            variants_string.push(',');
        }
    }
    variants_string.push('}');
    Ok(variants_string)
}

fn variant_type_description(
    variant: &Variant<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let fields_string = fields_type_description(&variant.fields, registry, cache)?;
    let output = if fields_string == "()" {
        variant.name.to_string()
    } else if fields_string.starts_with('(') {
        format!("{}{}", &variant.name, fields_string)
    } else {
        format!("{} {}", &variant.name, fields_string)
    };
    Ok(output)
}

fn fields_type_description(
    fields: &[Field<PortableForm>],
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    if fields.is_empty() {
        return Ok("()".to_string());
    }

    let all_fields_named = fields.iter().all(|f| f.name.is_some());
    let all_fields_unnamed = fields.iter().all(|f| f.name.is_none());
    let brackets = match (all_fields_named, all_fields_unnamed) {
        (true, false) => ('{', '}'),
        (false, true) => ('(', ')'),
        _ => {
            return Err(anyhow::anyhow!(
                "combination of named and unnamed fields in compound type"
            ));
        }
    };

    let mut fields_string = String::new();
    fields_string.push(brackets.0);
    let mut iter = fields.iter().peekable();
    while let Some(field) = iter.next() {
        let field_description = field_type_description(field, registry, cache)?;
        fields_string.push_str(&field_description);

        if iter.peek().is_some() {
            fields_string.push(',')
        }
    }
    fields_string.push(brackets.1);
    Ok(fields_string)
}

fn field_type_description(
    field: &Field<PortableForm>,
    registry: &PortableRegistry,
    cache: &mut HashMap<u32, CachedDescription>,
) -> anyhow::Result<String> {
    let type_description = type_description(field.ty.id, registry, cache)?;
    let type_description_maybe_named = if let Some(name) = &field.name {
        format!("{}: {}", name, type_description)
    } else {
        type_description
    };
    Ok(type_description_maybe_named)
}
