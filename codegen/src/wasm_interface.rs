//! Interface callable from JavaScript

use std::{borrow::Cow, convert::Infallible, fmt::Debug, ops::FromResidual, sync::Arc};

use anyhow::anyhow;

mod client_object;

use scale_typegen_description::type_description;
use serde::Serialize;
use subxt::{
    client::{LightClient, LightClientBuilder},
    ext::codec::Decode,
    OfflineClient, OnlineClient, PolkadotConfig,
};
use subxt_metadata::{Metadata, PalletMetadata, RuntimeApiMetadata};

use wasm_bindgen::{convert::IntoWasmAbi, prelude::*};

use crate::{
    context::ExampleContext, format_code, format_scale_value_string, format_type,
    storage_entry_key_ty_ids, ExampleGenerator, PruneTypePath,
};

use self::client_object::{OfflineClientObject, OnlineClientObject};

#[macro_export]
macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

}

type ConfigUsed = PolkadotConfig;

#[wasm_bindgen]
pub struct Client {
    offline_client: Arc<dyn OfflineClientObject<ConfigUsed>>,
    online_client: Option<Arc<dyn OnlineClientObject<ConfigUsed>>>,
    example_gen_dynamic: ExampleGenerator<'static>,
    example_gen_static: ExampleGenerator<'static>,
}

pub enum ClientConfig {
    Offline {
        metadata_file_name: String,
        client: OfflineClient<ConfigUsed>,
    },
    Online {
        url: String,
        client: OnlineClient<ConfigUsed>,
    },
    LightClient {
        chain_spec: String,
        client: LightClient<ConfigUsed>,
    },
}

impl ClientConfig {
    fn example_context(&self, dynamic: bool) -> ExampleContext {
        match &self {
            ClientConfig::Offline {
                metadata_file_name, ..
            } => ExampleContext::from_file(metadata_file_name, dynamic),
            ClientConfig::Online { url, .. } => ExampleContext::from_url(url, dynamic),
            ClientConfig::LightClient { .. } => {
                ExampleContext::from_file("metadata.scale", dynamic)
            }
        }
    }
}

impl Client {
    fn new(config: ClientConfig) -> Self {
        let offline_client: Arc<dyn OfflineClientObject<ConfigUsed>>;
        let online_client: Option<Arc<dyn OnlineClientObject<ConfigUsed>>>;

        (offline_client, online_client) = match &config {
            ClientConfig::Offline { client, .. } => (
                Arc::new(client.clone()) as Arc<dyn OfflineClientObject<ConfigUsed>>,
                None,
            ),
            ClientConfig::Online { client, .. } => (
                Arc::new(client.clone()) as Arc<dyn OfflineClientObject<ConfigUsed>>,
                Some(Arc::new(client.clone()) as Arc<dyn OnlineClientObject<ConfigUsed>>),
            ),
            ClientConfig::LightClient { client, .. } => (
                Arc::new(client.clone()) as Arc<dyn OfflineClientObject<ConfigUsed>>,
                Some(Arc::new(client.clone()) as Arc<dyn OnlineClientObject<ConfigUsed>>),
            ),
        };

        let metadata = offline_client.metadata();
        let example_gen_dynamic =
            ExampleGenerator::new(metadata.clone(), Cow::Owned(config.example_context(true)));
        let example_gen_static =
            ExampleGenerator::new(metadata, Cow::Owned(config.example_context(false)));
        Self {
            offline_client,
            online_client,
            example_gen_dynamic,
            example_gen_static,
        }
    }

    fn metadata(&self) -> subxt::Metadata {
        self.offline_client.metadata()
    }

    /// resolves the provided type id and returns the type path as a string.
    fn resolve_type_path(&self, type_id: u32) -> Option<String> {
        let type_gen = self.example_gen_static.type_gen();
        let type_path_string = type_gen
            .resolve_type_path(type_id)
            .expect("typed should be present")
            .prune()
            .to_string();
        let type_path_string = format_type(&type_path_string);
        Some(type_path_string)
    }

    fn type_description(&self, type_id: u32) -> anyhow::Result<TypeDescription> {
        let type_path = self
            .resolve_type_path(type_id)
            .ok_or_else(|| anyhow!("type with id {type_id} not found."))?;
        let type_structure = type_description(type_id, self.metadata().types(), true)?;

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
    #[wasm_bindgen(js_name = "newOffline")]
    pub fn new_offline(
        metadata_file_name: &str,
        bytes: js_sys::Uint8Array,
    ) -> Result<Client, String> {
        console_error_panic_hook::set_once();
        // AFAIK no efficient way to just "view" the Uint8Array withput copying the bytes.
        let bytes = bytes.to_vec();
        let metadata: Metadata = Metadata::decode(&mut &bytes[..]).map_err(|e| format!("{e}"))?;

        let client = OfflineClient::<ConfigUsed>::new(
            // should not matter much:
            Default::default(),
            // should not matter much:
            subxt::backend::RuntimeVersion {
                spec_version: 0,
                transaction_version: 0,
            },
            metadata,
        );

        Ok(Client::new(ClientConfig::Offline {
            metadata_file_name: metadata_file_name.into(),
            client,
        }))
    }

    /// Creates an OnlineClient from a given url
    #[wasm_bindgen(js_name = "newOnline")]
    pub async fn new_online(url: &str) -> Result<Client, String> {
        console_error_panic_hook::set_once();
        console_log!("create client from url {url}");
        let client = subxt::OnlineClient::<ConfigUsed>::from_url(url)
            .await
            .map_err(|e| e.to_string())?;
        Ok(Client::new(ClientConfig::Online {
            url: url.into(),
            client,
        }))
    }

    /// Creates an LightClient from a given chain spec string.
    ///
    /// `chain_spec` is expected to be a JSON string that contains the bootnodes and other information.
    #[wasm_bindgen(js_name = "newLightClient")]
    pub async fn new_light_client(chain_spec: String) -> Result<Client, String> {
        console_error_panic_hook::set_once();
        console_log!("create light client from a chain spec");
        let client = LightClientBuilder::<ConfigUsed>::new()
            .build(&chain_spec)
            .await
            .map_err(|e| e.to_string())?;
        console_log!("light client creation successful");
        Ok(Client::new(ClientConfig::LightClient {
            chain_spec,
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
                    name: Cow::Borrowed(name),
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

        let value = self
            .offline_client
            .constant_at(pallet_name, constant_name)?;
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

    #[wasm_bindgen(js_name = "eventContent")]
    pub fn event_content(&self, pallet_name: &str, event_name: &str) -> MyJsValue {
        let metadata = self.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let event = pallet_metadata
            .event_variants()?
            .iter()
            .find(|e| e.name == event_name)?;

        let field_types = event
            .fields
            .iter()
            .enumerate()
            .map(|(i, field)| {
                let name = field
                    .name
                    .as_ref()
                    .map(|name| Cow::Borrowed(name.as_str()))
                    .unwrap_or_else(|| Cow::Owned(format!("_{i}")));
                let type_description = self.type_description(field.ty.id)?;
                Ok(NameAndType {
                    name,
                    type_description,
                })
            })
            .collect::<Result<Vec<_>, anyhow::Error>>()?;

        let content = EventContent {
            pallet_name,
            name: &event.name,
            docs: &event.docs,
            field_types: &field_types,
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
                        name: Cow::Borrowed(&e.name),
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
        let online_client = self.online_client.as_ref()?;
        let metadata = online_client.metadata();
        let pallet_metadata = metadata.pallet_by_name(pallet_name)?;
        let storage = pallet_metadata.storage()?;
        let entry = storage.entry_by_name(entry_name)?;

        if entry.entry_type().key_ty().is_some() {
            return JsValue::UNDEFINED.into();
        }
        let value = online_client
            .key_less_storage_at(pallet_name, entry_name)
            .await?;
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

        // sort all pallets by name, not by index
        pallets.sort_by(|a, b| a.name.cmp(b.name));

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
    pub events: Vec<&'a str>,
}

impl<'a> PalletContent<'a> {
    pub fn from_pallet_metadata(pallet_metadata: PalletMetadata<'a>) -> PalletContent<'a> {
        let name = pallet_metadata.name();
        let calls: Vec<&str> = pallet_metadata
            .call_variants()
            .map(|c| c.iter().map(|c| c.name.as_str()).collect())
            .unwrap_or_default();
        let storage_items = pallet_metadata
            .storage()
            .map(|s| s.entries().iter().map(|s| s.name()).collect())
            .unwrap_or_default();

        let constants = pallet_metadata.constants().map(|c| c.name()).collect();

        let events = pallet_metadata
            .event_variants()
            .map(|e| e.iter().map(|e| e.name.as_str()).collect())
            .unwrap_or_default();

        PalletContent {
            index: pallet_metadata.index(),
            name,
            calls,
            storage_entries: storage_items,
            constants,
            events,
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

/// Represents all the information about a pallet event that we want to show to a user.
#[derive(Serialize)]
pub struct EventContent<'a> {
    pub pallet_name: &'a str,
    pub name: &'a str,
    pub docs: &'a [String],
    pub field_types: &'a [NameAndType<'a>],
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
    pub name: Cow<'a, str>,
    // just out of convenience a String. Should not matter too much
    pub type_description: TypeDescription,
}

#[derive(Serialize)]
pub struct TypeDescription {
    pub type_path: String,
    pub type_structure: String,
}
