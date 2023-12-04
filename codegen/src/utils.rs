use anyhow::anyhow;
use proc_macro2::TokenStream;
use quote::quote;
use regex::{Captures, Regex};
use scale_info::{form::PortableForm, PortableRegistry, Type};
use scale_typegen_description::{
    rust_value_from_seed, scale_typegen::TypeGenerator, type_example::rust_value::TyMiddleware,
};

pub fn scale_value_type_example(id: u32, types: &PortableRegistry) -> anyhow::Result<TokenStream> {
    let value = scale_typegen_description::scale_value(id, types)?;
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

/// replaces all occurances of bits from this: `<01011>` to this: `bits![0,1,0,1,1]`
fn replace_bits_with_bit_macros(input: &str) -> String {
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

pub fn rust_value_type_example(
    type_id: u32,
    type_gen: &TypeGenerator,
) -> anyhow::Result<TokenStream> {
    let ty_middleware: TyMiddleware = Box::new(|ty: &Type<PortableForm>, transformer| {
        fn ty_name_is(ty: &Type<PortableForm>, str: &str) -> bool {
            ty.path.ident().as_ref().map(|e| e == str).unwrap_or(false)
        }

        if ty_name_is(ty, "UncheckedExtrinsic") {
            let expr = quote!(subxt::utils::UncheckedExtrinsic::new(vec![1, 2, 3, 4]));
            Some(Ok(expr))
        } else if ty_name_is(ty, "AccountId32") {
            let expr = quote!(dev::bob().public_key().into());
            Some(Ok(expr))
        } else if ty_name_is(ty, "BTreeMap") {
            let expr_or_err = try {
                let key_ty = ty
                    .type_params
                    .first()
                    .ok_or_else(|| anyhow!("type name is BTreeMap, we expect 2 type paramters."))?
                    .ty
                    .ok_or_else(|| anyhow!("key_ty of BTreeMap has invalid type"))?;
                let key_example = transformer.resolve(key_ty.id)?;

                let value_ty = ty
                    .type_params
                    .get(1)
                    .ok_or_else(|| anyhow!("type name is BTreeMap, we expect 2 type paramters."))?
                    .ty
                    .ok_or_else(|| anyhow!("value_ty of BTreeMap has invalid type"))?;

                let value_example = transformer.resolve(value_ty.id)?;
                quote!(vec![(#key_example, #value_example)])
            };

            Some(expr_or_err)
        } else {
            None
        }
    });

    let ty_path_middleware: Box<dyn Fn(TokenStream) -> TokenStream> = Box::new(|tokens| {
        const PATH_SEGMENTS_REPLACEMENTS: &[(&str, &str)] = &[
            ("::subxt::utils::", ""),
            ("::subxt", "subxt"),
            ("::std::vec::Vec", "Vec"),
            ("::core::option::Option", "Option"),
            ("::core::primitive::", ""),
        ];
        let mut s = tokens.to_string();
        s = s.replace(' ', "");
        for (from, to) in PATH_SEGMENTS_REPLACEMENTS {
            s = s.replace(from, to);
        }
        s.parse()
            .expect("the replacement above should result in valid paths, qed.")
    });

    let result = rust_value_from_seed(
        type_id,
        type_gen.types(),
        type_gen.settings(),
        42,
        Some(ty_middleware),
        Some(ty_path_middleware),
    )?;
    Ok(result)
}
