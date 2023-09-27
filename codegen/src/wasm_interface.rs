//! Interface callable from JavaScript

use std::{borrow::Cow, convert::Infallible, fmt::Debug, ops::FromResidual};

use anyhow::anyhow;

use serde::Serialize;
use subxt::{
    ext::{codec::Decode, scale_value},
    OfflineClient, OnlineClient, SubstrateConfig,
};
use subxt_metadata::{Metadata, PalletMetadata, RuntimeApiMetadata};
use wasm_bindgen::{convert::IntoWasmAbi, prelude::*};

use crate::{
    context::ExampleContext, descriptions::type_structure_description, format_code,
    format_scale_value_string, format_type, storage_entry_key_ty_ids, ExampleGenerator,
    PruneTypePath,
};

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

}

#[wasm_bindgen]
pub struct Client {
    kind: ClientKind,
    example_gen_dynamic: ExampleGenerator<'static>,
    example_gen_static: ExampleGenerator<'static>,
}

pub enum ClientKind {
    Offline {
        metadata_file_name: String,
        client: OfflineClient<SubstrateConfig>,
    },
    Online {
        url: String,
        client: OnlineClient<SubstrateConfig>,
    },
}

impl ClientKind {
    fn example_context(&self, dynamic: bool) -> ExampleContext {
        match &self {
            ClientKind::Offline {
                metadata_file_name, ..
            } => ExampleContext::from_file(metadata_file_name, dynamic),
            ClientKind::Online { url, .. } => ExampleContext::from_url(url, dynamic),
        }
    }

    fn metadata(&self) -> subxt::Metadata {
        match &self {
            ClientKind::Offline { client, .. } => client.metadata(),
            ClientKind::Online { client, .. } => client.metadata(),
        }
    }

    fn online_client(&self) -> Option<&OnlineClient<SubstrateConfig>> {
        match &self {
            ClientKind::Offline { .. } => None,
            ClientKind::Online { client, .. } => Some(client),
        }
    }
}

impl Client {
    fn metadata(&self) -> subxt::Metadata {
        self.kind.metadata()
    }

    // dynamic lookup of constant value
    fn constant_at(
        &self,
        pallet_name: &str,
        constant_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let address = subxt::constants::dynamic(pallet_name, constant_name);
        let decoded_value_thunk = match &self.kind {
            ClientKind::Offline { client, .. } => {
                let constants_client = client.constants();
                constants_client.at(&address)?
            }
            ClientKind::Online { client, .. } => {
                let constants_client = client.constants();
                constants_client.at(&address)?
            }
        };
        let scale_value = decoded_value_thunk.to_value()?;
        Ok(scale_value)
    }

    fn new(kind: ClientKind) -> Self {
        let metadata = kind.metadata();
        let example_gen_dynamic =
            ExampleGenerator::new(metadata.clone(), Cow::Owned(kind.example_context(true)));
        let example_gen_static =
            ExampleGenerator::new(metadata, Cow::Owned(kind.example_context(false)));
        Self {
            kind,
            example_gen_dynamic,
            example_gen_static,
        }
    }

    /// resolves the provided type id and returns the type path as a string.
    fn resolve_type_path(&self, type_id: u32) -> Option<String> {
        let type_gen = self.example_gen_static.type_gen();
        type_gen.types().resolve(type_id)?;
        let type_path_string = type_gen.resolve_type_path(type_id).prune().to_string();
        let type_path_string = format_type(&type_path_string);
        Some(type_path_string)
    }

    fn type_description(&self, type_id: u32) -> anyhow::Result<TypeDescription> {
        let type_path = self
            .resolve_type_path(type_id)
            .ok_or_else(|| anyhow!("type with id {type_id} not found."))?;
        let type_structure = type_structure_description(type_id, &self.metadata())?;

        Ok(TypeDescription {
            type_path,
            type_structure,
        })
    }
}

#[wasm_bindgen]
impl Client {
    /// Creates an offline client from the metadata bytes and the name of the metadata file.
    ///
    /// genesis_hash and runtime_version are set to some unimportant default values and hopefully not used.
    #[wasm_bindgen(js_name = "fromBytes")]
    pub fn from_bytes(
        metadata_file_name: &str,
        bytes: js_sys::Uint8Array,
    ) -> Result<Client, String> {
        console_error_panic_hook::set_once();
        // AFAIK no efficient way to just "view" the Uint8Array withput copying the bytes.
        let bytes = bytes.to_vec();
        let metadata: Metadata = Metadata::decode(&mut &bytes[..]).map_err(|e| format!("{e}"))?;

        let client = OfflineClient::<SubstrateConfig>::new(
            // should not matter much:
            Default::default(),
            // should not matter much:
            subxt::backend::RuntimeVersion {
                spec_version: 0,
                transaction_version: 0,
            },
            metadata,
        );

        Ok(Client::new(ClientKind::Offline {
            metadata_file_name: metadata_file_name.into(),
            client,
        }))
    }

    /// Creates an OnlineClient from a given url
    #[wasm_bindgen(js_name = "fromUrl")]
    pub async fn from_url(url: &str) -> Result<Client, String> {
        console_error_panic_hook::set_once();
        console_log!("try to create client from url {url}");
        let client = subxt::OnlineClient::<SubstrateConfig>::from_url(url)
            .await
            .map_err(|e| e.to_string())?;
        Ok(Client::new(ClientKind::Online {
            url: url.into(),
            client,
        }))
    }

    #[wasm_bindgen(js_name = "metadataContent")]
    pub fn metadata_content(&self) -> JsValue {
        let metadata = self.metadata();
        let contents = MetadataContent::from_metadata(&metadata);
        serde_wasm_bindgen::to_value(&contents).expect("should always work")
    }

    #[wasm_bindgen(js_name = "palletDocs")]
    pub fn pallet_docs(&self, pallet_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        serde_wasm_bindgen::to_value(pallet_metadata.docs())
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "palletContent")]
    pub fn pallet_content(&self, pallet_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let pallet_content = PalletContent::from_pallet_metadata(pallet_metadata);
        console_log!("pallet {pallet_name} found, content: {pallet_content:?}");
        serde_wasm_bindgen::to_value(&pallet_content)
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "callContent")]
    pub fn call_content(&self, pallet_name: &str, call_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let call = pallet_metadata.call_variant_by_name(call_name)?;

        let argument_types = call
            .fields
            .iter()
            .map(|field| {
                let name = field
                    .name
                    .as_ref()
                    .ok_or_else(|| anyhow!("field of call variant does not have name"))?;
                let type_description = self.type_description(field.ty.id)?;

                Ok(NameAndType {
                    name,
                    type_description,
                })
            })
            .collect::<Result<Vec<_>, anyhow::Error>>()?;

        // static code example
        let code_example_static = self
            .example_gen_static
            .call_example_wrapped(pallet_name, call_name)?;

        // dynamic code example
        let code_example_dynamic = self
            .example_gen_dynamic
            .call_example_wrapped(pallet_name, call_name)?;
        let content = CallContent {
            pallet_name,
            name: call_name,
            docs: &call.docs,
            code_example_static: &format_code(&code_example_static.to_string()),
            code_example_dynamic: &format_code(&code_example_dynamic.to_string()),
            argument_types: &argument_types,
        };
        serde_wasm_bindgen::to_value(&content)
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "storageEntryContent")]
    pub fn storage_entry_content(&self, pallet_name: &str, entry_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let storage = pallet_metadata.storage()?;
        let entry = storage.entry_by_name(entry_name)?;

        // static code example
        let code_example_static = self
            .example_gen_static
            .storage_example_wrapped(pallet_name, entry_name)?;

        // dynamic code example
        let code_example_dynamic = self
            .example_gen_dynamic
            .storage_example_wrapped(pallet_name, entry_name)?;

        let value_type = self.type_description(entry.entry_type().value_ty())?;
        let key_types: Vec<TypeDescription> =
            storage_entry_key_ty_ids(&self.example_gen_static.type_gen(), entry)
                .into_iter()
                .map(|ty_id| self.type_description(ty_id))
                .collect::<anyhow::Result<Vec<TypeDescription>>>()?;

        let content = StorageEntryContent {
            pallet_name,
            name: entry_name,
            docs: entry.docs(),
            value_type,
            key_types,
            code_example_static: &format_code(&code_example_static.to_string()),
            code_example_dynamic: &format_code(&code_example_dynamic.to_string()),
        };
        serde_wasm_bindgen::to_value(&content)
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "constantContent")]
    pub fn constant_content(&self, pallet_name: &str, constant_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let constant = pallet_metadata.constant_by_name(constant_name)?;

        // static code example
        let code_example_static = self
            .example_gen_static
            .constant_example_wrapped(pallet_name, constant_name)?;

        // dynamic code example
        let code_example_dynamic = self
            .example_gen_dynamic
            .constant_example_wrapped(pallet_name, constant_name)?;

        let value = self.constant_at(pallet_name, constant_name)?;
        let value_str = format_scale_value_string(&value.to_string());
        let value_type = self.type_description(constant.ty())?;

        let content = ConstantContent {
            pallet_name,
            name: constant_name,
            docs: constant.docs(),
            value_type,
            value: &value_str,
            code_example_static: &format_code(&code_example_static.to_string()),
            code_example_dynamic: &format_code(&code_example_dynamic.to_string()),
        };
        serde_wasm_bindgen::to_value(&content)
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "runtimeApiTraitDocs")]
    pub fn runtime_api_trait_docs(&self, runtime_api_trait_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let runtime_api = metadata.runtime_api_trait_by_name(runtime_api_trait_name)?;
        serde_wasm_bindgen::to_value(runtime_api.docs())
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "runtimeApiTraitContent")]
    pub fn runtime_api_trait_content(&self, runtime_api_trait_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let runtime_api = metadata.runtime_api_trait_by_name(runtime_api_trait_name)?;

        let content = RuntimeApiTraitContent::from_metadata(runtime_api);
        serde_wasm_bindgen::to_value(&content)
            .expect("should always work")
            .into()
    }

    #[wasm_bindgen(js_name = "runtimeApiMethodContent")]
    pub fn runtime_api_method_content(
        &self,
        runtime_api_trait_name: &str,
        method_name: &str,
    ) -> MyJsValue {
        let metadata = self.metadata();
        let runtime_api = metadata.runtime_api_trait_by_name(runtime_api_trait_name)?;
        let method = runtime_api.method_by_name(method_name)?;

        let input_types = method
            .inputs()
            .map(|e| {
                self.type_description(e.ty)
                    .map(|type_description| NameAndType {
                        name: &e.name,
                        type_description,
                    })
            })
            .collect::<anyhow::Result<Vec<NameAndType>>>()?;

        let value_type = self.type_description(method.output_ty())?;

        // static code example
        let code_example_static = self
            .example_gen_static
            .runtime_api_example_wrapped(runtime_api_trait_name, method_name)?;

        // dynamic code example
        let code_example_dynamic = self
            .example_gen_dynamic
            .runtime_api_example_wrapped(runtime_api_trait_name, method_name)?;

        let content = RuntimeApiMethodContent {
            runtime_api_trait_name,
            method_name,
            docs: method.docs(),
            code_example_static: &format_code(&code_example_static.to_string()),
            code_example_dynamic: &format_code(&code_example_dynamic.to_string()),
            input_types: &input_types,
            value_type,
        };

        serde_wasm_bindgen::to_value(&content)
            .expect("should always work")
            .into()
    }

    /// Dynamically fetches the value of a keyless storage entry.
    /// Only works if this is an online client.
    #[wasm_bindgen(js_name = "fetchKeylessStorageValue")]
    pub async fn fetch_keyless_storage_value(
        &self,
        pallet_name: &str,
        entry_name: &str,
    ) -> MyJsValue {
        let online_client = self.kind.online_client()?;
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let storage = pallet_metadata.storage()?;
        let entry = storage.entry_by_name(entry_name)?;

        if entry.entry_type().key_ty().is_some() {
            return JsValue::UNDEFINED.into();
        }

        let storage_client = online_client.storage().at_latest().await?;
        let storage_address = subxt::storage::dynamic::<()>(pallet_name, entry_name, vec![]);
        let value: scale_value::Value<u32> =
            storage_client.fetch(&storage_address).await??.to_value()?;
        let value_str = format_scale_value_string(&value.to_string());
        JsValue::from_str(&value_str).into()
    }
}

/// New-Type struct to implement short circuiting with `FromResidual` trait.
pub struct MyJsValue(JsValue);

impl FromResidual<Option<Infallible>> for MyJsValue {
    fn from_residual(_: Option<Infallible>) -> Self {
        MyJsValue(JsValue::UNDEFINED)
    }
}

impl<T: Debug> FromResidual<Result<Infallible, T>> for MyJsValue {
    fn from_residual(residual: Result<Infallible, T>) -> Self {
        console_log!("Error: {residual:?}. Returning JsValue::UNDEFINED");
        MyJsValue(JsValue::UNDEFINED)
    }
}

impl From<JsValue> for MyJsValue {
    fn from(value: JsValue) -> Self {
        Self(value)
    }
}

impl From<MyJsValue> for JsValue {
    fn from(value: MyJsValue) -> Self {
        value.0
    }
}

impl wasm_bindgen::describe::WasmDescribe for MyJsValue {
    fn describe() {
        JsValue::describe()
    }
}

impl wasm_bindgen::convert::IntoWasmAbi for MyJsValue {
    type Abi = <JsValue as IntoWasmAbi>::Abi;

    fn into_abi(self) -> Self::Abi {
        self.0.into_abi()
    }
}

#[derive(Serialize)]
pub struct MetadataContent<'a> {
    pallets: Vec<PalletContent<'a>>,
    runtime_apis: Vec<RuntimeApiTraitContent<'a>>,
    // note: String here, because I had lifetime issues otherwise
    custom_values: Vec<String>,
}

impl<'a> MetadataContent<'a> {
    pub fn from_metadata(metadata: &'a subxt_metadata::Metadata) -> MetadataContent<'a> {
        let mut pallets: Vec<PalletContent> = metadata
            .pallets()
            .map(PalletContent::from_pallet_metadata)
            .collect();
        pallets.sort_by(|a, b| a.index.cmp(&b.index));

        let runtime_apis: Vec<RuntimeApiTraitContent> = metadata
            .runtime_api_traits()
            .map(RuntimeApiTraitContent::from_metadata)
            .collect();
        let custom_values: Vec<String> = metadata
            .custom()
            .iter()
            .map(|e| e.name().to_string())
            .collect();

        MetadataContent {
            pallets,
            runtime_apis,
            custom_values,
        }
    }
}

#[derive(Serialize, Debug)]
pub struct PalletContent<'a> {
    pub index: u8,
    pub name: &'a str,
    pub calls: Vec<&'a str>,
    pub storage_entries: Vec<&'a str>,
    pub constants: Vec<&'a str>,
}

impl<'a> PalletContent<'a> {
    pub fn from_pallet_metadata(pallet_metadata: PalletMetadata<'a>) -> PalletContent<'a> {
        let name = pallet_metadata.name();
        let calls: Vec<&str> = if let Some(c) = pallet_metadata.call_variants() {
            c.iter().map(|c| c.name.as_str()).collect()
        } else {
            vec![]
        };
        let storage_items = if let Some(s) = pallet_metadata.storage() {
            s.entries().iter().map(|s| s.name()).collect()
        } else {
            vec![]
        };
        let constants = pallet_metadata.constants().map(|c| c.name()).collect();

        PalletContent {
            index: pallet_metadata.index(),
            name,
            calls,
            storage_entries: storage_items,
            constants,
        }
    }
}

#[derive(Serialize, Debug)]
pub struct RuntimeApiTraitContent<'a> {
    pub name: &'a str,
    pub methods: Vec<&'a str>,
}

impl<'a> RuntimeApiTraitContent<'a> {
    pub fn from_metadata(metadata: RuntimeApiMetadata<'a>) -> RuntimeApiTraitContent<'a> {
        let methods: Vec<&str> = metadata.methods().map(|e| e.name()).collect();
        RuntimeApiTraitContent {
            name: metadata.name(),
            methods,
        }
    }
}

/// Represents all the information about a call that we want to show to a user.
#[derive(Serialize)]
pub struct CallContent<'a> {
    pub pallet_name: &'a str,
    pub name: &'a str,
    pub docs: &'a [String],
    pub code_example_static: &'a str,
    pub code_example_dynamic: &'a str,
    pub argument_types: &'a [NameAndType<'a>],
}

/// Represents all the information about a storage entry that we want to show to a user.
#[derive(Serialize)]
pub struct StorageEntryContent<'a> {
    pub pallet_name: &'a str,
    pub name: &'a str,
    pub docs: &'a [String],
    pub code_example_static: &'a str,
    pub code_example_dynamic: &'a str,
    pub value_type: TypeDescription,
    pub key_types: Vec<TypeDescription>,
}

/// Represents all the information about a constant that we want to show to a user.
#[derive(Serialize)]
pub struct ConstantContent<'a> {
    pub pallet_name: &'a str,
    pub name: &'a str,
    pub docs: &'a [String],
    pub code_example_static: &'a str,
    pub code_example_dynamic: &'a str,
    pub value: &'a str,
    pub value_type: TypeDescription,
}

#[derive(Serialize)]
pub struct RuntimeApiMethodContent<'a> {
    pub runtime_api_trait_name: &'a str,
    pub method_name: &'a str,
    pub docs: &'a [String],
    pub code_example_static: &'a str,
    pub code_example_dynamic: &'a str,
    pub input_types: &'a [NameAndType<'a>],
    pub value_type: TypeDescription,
}

#[derive(Serialize)]
pub struct NameAndType<'a> {
    pub name: &'a str,
    // just out of convenience a String. Should not matter too much
    pub type_description: TypeDescription,
}

#[derive(Serialize)]
pub struct TypeDescription {
    pub type_path: String,
    pub type_structure: String,
}
