use anyhow::{anyhow, Ok};

use proc_macro2::{TokenStream, TokenTree};
use quote::{format_ident, quote, ToTokens};
use scale_info::{form::PortableForm, Field, Type, TypeDef, TypeDefPrimitive};
use subxt_codegen::__private::{TypeDefGen, TypeGenerator};

use crate::PruneTypePath;

pub enum CompactMode {
    // explicitely stating Compact(u32)
    Expl,
    // compact encoded via attribute #[codec(compact)]
    Attr,
}

pub fn type_example(id: u32, type_gen: &TypeGenerator) -> anyhow::Result<TokenStream> {
    type_example_internal(id, type_gen, CompactMode::Attr)
}

pub fn type_example_internal(
    id: u32,
    type_gen: &TypeGenerator,
    compact_mode: CompactMode,
) -> anyhow::Result<TokenStream> {
    let ty = type_gen.resolve_type(id);
    type_def_example(type_gen, id, &ty, compact_mode)
}

fn type_def_example(
    type_gen: &TypeGenerator,
    id: u32,
    ty: &Type<PortableForm>,
    compact_mode: CompactMode,
) -> anyhow::Result<TokenStream> {
    fn last_path_segment(ty: &Type<PortableForm>, s: &str) -> bool {
        ty.path.segments.last().map_or(false, |e| e == s)
    }

    //
    // WARNING: HACKY CUSTOM LOGIC
    //
    // cannot use normal construction for `subxt::utils::UncheckedExtrinsic`, because phantom data is private.
    if last_path_segment(ty, "UncheckedExtrinsic") {
        return Ok(quote!(subxt::utils::UncheckedExtrinsic::new(vec![
            1, 2, 3, 4
        ])));
    }

    //
    // WARNING: HACKY CUSTOM LOGIC
    //
    // BtreeMaps are replaced by KeyedVec = Vec<K,V>, causes problems because the type alias is seen as a 1 element typle struct -> wrong example generation
    if last_path_segment(ty, "BTreeMap") {
        let key_ty = ty
            .type_params
            .get(0)
            .ok_or_else(|| anyhow!("type name is BTreeMap, we expect 2 type paramters."))?
            .ty
            .ok_or_else(|| anyhow!("key has no known type"))?;
        let value_ty = ty
            .type_params
            .get(1)
            .ok_or_else(|| anyhow!("type name is BTreeMap, we expect 2 type paramters."))?
            .ty
            .ok_or_else(|| anyhow!("key has no known type"))?;

        let key_example = type_example(key_ty.id, type_gen)?;
        let value_example = type_example(value_ty.id, type_gen)?;
        return Ok(quote!(vec![(#key_example, #value_example)]));
    }

    //
    // WARNING: HACKY CUSTOM LOGIC
    //
    // just makes it nicer to see AccountId examples in the generated code
    if last_path_segment(ty, "AccountId32") {
        return Ok(quote!(dev::bob().public_key().into()));
    }

    // general handling of type definitions
    match &ty.type_def {
        scale_info::TypeDef::Composite(def) => {
            let struct_path = resolve_type_path_omit_generics(type_gen, id);
            let gen_for_unsused_params =
                TypeDefGen::from_type(ty, type_gen, &crate::default_crate_path(), false)
                    .expect("should work");
            let fields: TokenStream = fields_example(
                type_gen,
                &def.fields,
                gen_for_unsused_params.has_unused_type_params(),
            )?;
            Ok(quote!(#struct_path #fields))
        }
        scale_info::TypeDef::Variant(def) => {
            // just take first variant:
            let enum_path = resolve_type_path_omit_generics(type_gen, id);
            let first_variant = def
                .variants
                .first()
                .ok_or(anyhow!("variant type should have at least one variant"))?;
            let variant_ident = format_ident!("{}", &first_variant.name);
            // Technically we also need for phantom types here, but that is quite difficult at the moment, because we only want to check for a single variant, and TypeDefGen does not support that right now
            // So for now, we set it to false.
            let fields = fields_example(type_gen, &first_variant.fields, false)?;
            let mut example = quote!(#enum_path::#variant_ident #fields);

            //
            // WARNING: HACKY CUSTOM LOGIC
            //
            // Note: this makes it such that Option::None is just shown as None.
            if example.to_string() == "Option :: None" {
                example = quote!(None);
            };
            Ok(example)
        }
        scale_info::TypeDef::Sequence(def) => {
            // return a Vec with 2 elements:
            let inner_ty = type_gen.resolve_type(def.type_param.id);
            let item_code =
                type_def_example(type_gen, def.type_param.id, &inner_ty, CompactMode::Expl)?;
            let vec_code = quote!(vec![#item_code, #item_code, #item_code]);
            Ok(vec_code)
        }
        scale_info::TypeDef::Array(def) => {
            let inner_ty = type_gen.resolve_type(def.type_param.id);
            let item_code =
                type_def_example(type_gen, def.type_param.id, &inner_ty, CompactMode::Expl)?;
            let inner_is_copy = type_def_is_copy(type_gen, &inner_ty.type_def);
            let len = def.len as usize;
            let arr_code = if inner_is_copy {
                // if the item_code is an expression that is `Copy` we can use short init syntax:
                quote!([#item_code;#len])
            } else {
                // otherwise we need to duplicate the item_code `len` times:
                let item_iter = (0..len).map(|_| &item_code);
                quote!([#(#item_iter),*])
            };
            Ok(arr_code)
        }
        scale_info::TypeDef::Tuple(def) => {
            let mut fields: Vec<TokenStream> = vec![];
            for f in &def.fields {
                let value = type_example_internal(f.id, type_gen, CompactMode::Expl)?;
                fields.push(value)
            }
            Ok(quote!(( #(#fields),* )))
        }
        scale_info::TypeDef::Primitive(def) => Ok(primitive_example(def)),
        scale_info::TypeDef::Compact(def) => {
            // there are actually two possibilities here:
            // 1. the value is not actually compact but just tagged with { #[codec(compact)] number: u8 } in the type definition.
            // --> give a normal primitive as a type example, e.g. 8
            // 2. the value is actually like (Compact<u8>, String) in the type definition.
            // --> give compact type example, e.g. Compact(8)

            // How to find out? In structs, we are gonna be in case 1, otherwise (inside a tuple, array or vec) where the #[codec(compact)] is not possible, we are in case 2.
            // `explicit_compact` flag is used to indicate we are in case 2.

            let inner_code = type_example_internal(def.type_param.id, type_gen, CompactMode::Expl)?;
            // I used this originally, but it turns out the compact part should be omitted:

            let code = match compact_mode {
                CompactMode::Expl => {
                    let compact_path = resolve_type_path_omit_generics(type_gen, id);
                    quote!(#compact_path(#inner_code))
                }
                CompactMode::Attr => inner_code,
            };

            Ok(code)
        }
        scale_info::TypeDef::BitSequence(_def) => {
            Ok(quote!(subxt::utils::bits::DecodedBits::from_iter([
                true, false, false
            ])))
        }
    }
}

fn fields_example(
    type_gen: &TypeGenerator,
    fields: &[Field<PortableForm>],
    has_unused_type_params: bool,
) -> anyhow::Result<TokenStream> {
    let all_named = fields.iter().all(|f| f.name.is_some());
    let all_unnamed = fields.iter().all(|f| f.name.is_none());
    match (all_named, all_unnamed) {
        (true, false) => {
            // all fields named
            let mut field_idents_and_values: Vec<TokenStream> = vec![];
            for f in fields {
                let name = f.name.as_ref().expect("safe because of check above; qed");
                let ident = format_ident!("{name}");
                let value_code = type_example_internal(f.ty.id, type_gen, CompactMode::Attr)?;
                field_idents_and_values.push(quote!(#ident : #value_code));
            }
            // maybe add phantom data to struct / named composite enum
            let maybe_phantom = if has_unused_type_params {
                quote!( __subxt_unused_type_params: ::core::marker::PhantomData )
            } else {
                quote!()
            };
            Ok(quote!({ #(#field_idents_and_values ,)* #maybe_phantom }))
        }
        (false, true) => {
            // all fields unnamed
            let mut field_values: Vec<TokenStream> = vec![];
            for f in fields {
                let value_code = type_example_internal(f.ty.id, type_gen, CompactMode::Attr)?;
                field_values.push(value_code);
            }
            // maybe add phantom data to struct / named composite enum
            let maybe_phantom = if has_unused_type_params {
                quote!(::core::marker::PhantomData)
            } else {
                quote!()
            };
            Ok(quote!(( #(#field_values ,)* #maybe_phantom )))
        }
        (true, true) => {
            // no fields
            Ok(quote!())
        }
        (false, false) => {
            // mixed fields
            Err(anyhow!("mixed fields in struct def"))
        }
    }
}

fn primitive_example(def: &TypeDefPrimitive) -> TokenStream {
    match def {
        TypeDefPrimitive::Bool => quote!(false),
        TypeDefPrimitive::Char => quote!('c'),
        TypeDefPrimitive::Str => quote!("Hello".into()),
        TypeDefPrimitive::U8 => quote!(8),
        TypeDefPrimitive::U16 => quote!(16),
        TypeDefPrimitive::U32 => quote!(32),
        TypeDefPrimitive::U64 => quote!(64),
        TypeDefPrimitive::U128 => quote!(128),
        TypeDefPrimitive::U256 => quote!(256),
        TypeDefPrimitive::I8 => quote!(-8),
        TypeDefPrimitive::I16 => quote!(-16),
        TypeDefPrimitive::I32 => quote!(-32),
        TypeDefPrimitive::I64 => quote!(-64),
        TypeDefPrimitive::I128 => quote!(-128),
        TypeDefPrimitive::I256 => quote!(-256),
    }
}

/// Simple Heuristics. Just makes array initialization shorter if is `Copy`.
fn type_def_is_copy(type_gen: &TypeGenerator, ty: &TypeDef<PortableForm>) -> bool {
    match ty {
        TypeDef::Primitive(def) => !matches!(def, TypeDefPrimitive::Str),
        scale_info::TypeDef::Array(def) => {
            let item_type = type_gen.resolve_type(def.type_param.id);
            def.len <= 32 && type_def_is_copy(type_gen, &item_type.type_def)
        }
        scale_info::TypeDef::Tuple(def) => def.fields.iter().all(|f| {
            let ty = type_gen.resolve_type(f.id);
            type_def_is_copy(type_gen, &ty.type_def)
        }),

        scale_info::TypeDef::Compact(def) => {
            let ty = type_gen.resolve_type(def.type_param.id);
            type_def_is_copy(type_gen, &ty.type_def)
        }
        _ => false,
    }
}

/// Converts e.g. HashMap<u8, u16> => HashMap
///
/// This is a workaround, should probably be handled with syn::Expr somehow
fn resolve_type_path_omit_generics(type_gen: &TypeGenerator, id: u32) -> TokenStream {
    let path = type_gen.resolve_type_path(id).prune();

    let path: TokenStream = path
        .to_token_stream()
        .into_iter()
        .take_while(|t| match t {
            TokenTree::Punct(p) => p.as_char() != '<',
            _ => true,
        })
        .collect();

    path
}
