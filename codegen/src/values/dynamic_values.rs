use anyhow::{anyhow, Ok};
use proc_macro2::TokenStream;
use scale_info::{form::PortableForm, PortableRegistry, TypeDef, TypeDefPrimitive};
use subxt::ext::scale_value::{BitSequence, Composite, Primitive, Value, ValueDef, Variant};
// use scale_value::Value;
use regex::{Captures, Regex};
// use scale_value::{BitSequence, Composite, Primitive, Value, ValueDef, Variant};
pub fn type_example(id: u32, types: &PortableRegistry) -> anyhow::Result<TokenStream> {
    let value: Value = type_id_example(id, types)?;
    // A scale value that is made into a string should fit the schema the value! macro expects.
    let value_string = value.to_string();
    // However there is one caveat: BitSequences. Bitsequences in the string are represented as e.g. <0110>.
    // The scale value macro does not support these. But we can use the bits! macro from scale_bits e.g. bits![0,1,1,0]
    let value_string = replace_bits_with_bit_macros(&value_string);

    let mut value_macro_string = format!("value!{{{value_string}}}");

    if value_macro_string.len() > 500 {
        value_macro_string =
            r#"todo!("Value string is very long and will likely exceed recursion limit.")"#.into();
    }
    let token_stream: TokenStream = value_macro_string
        .parse()
        .map_err(|_| anyhow!("Cannot convert {value_macro_string} into TokenStream."))?;
    Ok(token_stream)
}

pub fn type_id_example(id: u32, types: &PortableRegistry) -> anyhow::Result<Value> {
    let ty = types
        .resolve(id)
        .ok_or(anyhow!("Type with id {id} not found in registry"))?;
    type_def_example(&ty.type_def, types)
}

fn type_def_example(
    type_def: &TypeDef<PortableForm>,
    types: &PortableRegistry,
) -> anyhow::Result<Value> {
    match type_def {
        TypeDef::Composite(composite) => {
            let fields = composite.fields.iter().map(|e| (e.name.as_ref(), e.ty.id));
            let composite = fields_type_example(fields, types)?;
            Ok(Value {
                value: ValueDef::Composite(composite),
                context: (),
            })
        }
        TypeDef::Variant(variant) => {
            let first = variant
                .variants
                .first()
                .ok_or_else(|| anyhow!("Variant type should have at least one variant"))?;
            let fields = first.fields.iter().map(|e| (e.name.as_ref(), e.ty.id));
            let composite = fields_type_example(fields, types)?;
            Ok(Value {
                value: ValueDef::Variant(Variant {
                    name: first.name.clone(),
                    values: composite,
                }),
                context: (),
            })
        }
        TypeDef::Sequence(sequence) => {
            let example = type_id_example(sequence.type_param.id, types)?;
            Ok(Value::unnamed_composite([
                example.clone(),
                example.clone(),
                example,
            ]))
        }
        TypeDef::Array(array) => {
            let example = type_id_example(array.type_param.id, types)?;
            let elements: Vec<_> = (0..array.len).map(|_| example.clone()).collect();
            Ok(Value::unnamed_composite(elements))
        }
        TypeDef::Tuple(tuple) => {
            let fields = tuple.fields.iter().map(|e| (None::<&str>, e.id));
            let composite = fields_type_example(fields, types)?;
            Ok(Value {
                value: ValueDef::Composite(composite),
                context: (),
            })
        }
        TypeDef::Primitive(primitive) => Ok(primitive_type_def_example(primitive)),
        TypeDef::Compact(compact) => type_id_example(compact.type_param.id, types),
        TypeDef::BitSequence(_) => Ok(Value::bit_sequence(BitSequence::new())),
    }
}

fn primitive_type_def_example(primitive: &TypeDefPrimitive) -> Value {
    let primitive: Primitive = match primitive {
        TypeDefPrimitive::Bool => Primitive::Bool(true),
        TypeDefPrimitive::Char => Primitive::Char('a'),
        TypeDefPrimitive::Str => Primitive::String("Hello".into()),
        TypeDefPrimitive::U8 => Primitive::U128(8),
        TypeDefPrimitive::U16 => Primitive::U128(16),
        TypeDefPrimitive::U32 => Primitive::U128(32),
        TypeDefPrimitive::U64 => Primitive::U128(64),
        TypeDefPrimitive::U128 => Primitive::U128(128),
        TypeDefPrimitive::U256 => Primitive::U256(Default::default()),
        TypeDefPrimitive::I8 => Primitive::I128(8),
        TypeDefPrimitive::I16 => Primitive::I128(16),
        TypeDefPrimitive::I32 => Primitive::I128(32),
        TypeDefPrimitive::I64 => Primitive::I128(64),
        TypeDefPrimitive::I128 => Primitive::I128(128),
        TypeDefPrimitive::I256 => Primitive::I256(Default::default()),
    };
    Value::primitive(primitive)
}

fn fields_type_example(
    fields: impl Iterator<Item = (Option<impl AsRef<str>>, u32)> + Clone,
    types: &PortableRegistry,
) -> anyhow::Result<Composite<()>> {
    let all_fields_named = fields.clone().all(|e| e.0.is_some());
    let all_fields_unnamed = fields.clone().all(|e| e.0.is_none());
    match (all_fields_named, all_fields_unnamed) {
        (true, true) => Ok(Composite::Unnamed(vec![])),
        (true, false) => {
            let mut elements: Vec<(String, Value)> = vec![];
            for (name, id) in fields {
                let field_value = type_id_example(id, types)?;
                let name = name.unwrap().as_ref().into();
                elements.push((name, field_value));
            }
            Ok(Composite::named(elements))
        }
        (false, true) => {
            let mut elements = vec![];
            for (_, id) in fields {
                let field_value = type_id_example(id, types)?;
                elements.push(field_value);
            }
            Ok(Composite::unnamed(elements))
        }
        (false, false) => Err(anyhow!(
            "Composite should not have unnamed and named fields"
        )),
    }
}

/// replaces all occurances of bits from this: `<01011>` to this: `bits![0,1,0,1,1]`
pub fn replace_bits_with_bit_macros(input: &str) -> String {
    let re = Regex::new(r"<([01]*)>").unwrap();
    let replacement_fn = |caps: &Captures| -> String {
        let cap = caps
            .get(1)
            .expect("should be there because capture group specified in regex above.");
        let mut bits_string: String = "bits![".into();
        for (i, bin_digit) in caps[1].chars().enumerate() {
            bits_string.push(bin_digit);
            if i != cap.len() - 1 {
                bits_string.push(',')
            }
        }
        bits_string.push(']');
        bits_string
    };
    re.replace_all(input, replacement_fn).into_owned()
}
