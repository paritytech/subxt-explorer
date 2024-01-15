use async_trait::async_trait;
use subxt::{
    client::{LightClient, OfflineClientT},
    ext::scale_value,
    Config, Metadata, OfflineClient, OnlineClient,
};

use anyhow::anyhow;

/// Todo: these implementations could maybe be done by a macro that copies the code 2 or 3 times.
pub(crate) trait OfflineClientObject<T: Config> {
    fn metadata(&self) -> Metadata;
    fn constant_at(
        &self,
        pallet_name: &str,
        constant_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>>;
}

impl<T: Config> OfflineClientObject<T> for OfflineClient<T> {
    fn metadata(&self) -> Metadata {
        OfflineClientT::metadata(self)
    }

    fn constant_at(
        &self,
        pallet_name: &str,
        constant_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let address = subxt::constants::dynamic(pallet_name, constant_name);
        let constants_client = OfflineClientT::constants(self);
        let decoded_value_thunk = constants_client.at(&address)?;
        let scale_value = decoded_value_thunk.to_value()?;
        Ok(scale_value)
    }
}

impl<T: Config> OfflineClientObject<T> for OnlineClient<T> {
    fn metadata(&self) -> Metadata {
        OfflineClientT::metadata(self)
    }

    fn constant_at(
        &self,
        pallet_name: &str,
        constant_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let address = subxt::constants::dynamic(pallet_name, constant_name);
        let constants_client = OfflineClientT::constants(self);
        let decoded_value_thunk = constants_client.at(&address)?;
        let scale_value = decoded_value_thunk.to_value()?;
        Ok(scale_value)
    }
}
impl<T: Config> OfflineClientObject<T> for LightClient<T> {
    fn metadata(&self) -> Metadata {
        OfflineClientT::metadata(self)
    }

    fn constant_at(
        &self,
        pallet_name: &str,
        constant_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let address = subxt::constants::dynamic(pallet_name, constant_name);
        let constants_client = OfflineClientT::constants(self);
        let decoded_value_thunk = constants_client.at(&address)?;
        let scale_value = decoded_value_thunk.to_value()?;
        Ok(scale_value)
    }
}

#[async_trait]
pub trait OnlineClientObject<T: Config>: OfflineClientObject<T> {
    async fn keyless_storage_at(
        &self,
        pallet_name: &str,
        entry_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>>;

    async fn call_inputless_runtime_api_method(
        &self,
        api_name: &str,
        method_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>>;
}

#[async_trait]
impl<T: Config> OnlineClientObject<T> for OnlineClient<T> {
    async fn keyless_storage_at(
        &self,
        pallet_name: &str,
        entry_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let storage_client = self.storage().at_latest().await?;
        let storage_address = subxt::storage::dynamic::<()>(pallet_name, entry_name, vec![]);
        let value: scale_value::Value<u32> = storage_client
            .fetch(&storage_address)
            .await?
            .ok_or_else(|| anyhow!("No storage value found"))?
            .to_value()?;
        Ok(value)
    }

    async fn call_inputless_runtime_api_method(
        &self,
        api_name: &str,
        method_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let api_client = self.runtime_api().at_latest().await?;
        let value = api_client
            .call(subxt::runtime_api::dynamic(
                api_name,
                method_name,
                scale_value::Composite::Unnamed(vec![]),
            ))
            .await
            .map_err(|_| anyhow!("Runtime Api Call failed"))?
            .to_value()?;
        Ok(value)
    }
}

#[async_trait]
impl<T: Config> OnlineClientObject<T> for LightClient<T> {
    async fn keyless_storage_at(
        &self,
        pallet_name: &str,
        entry_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let storage_client = self.storage().at_latest().await?;
        let storage_address = subxt::storage::dynamic::<()>(pallet_name, entry_name, vec![]);
        let value: scale_value::Value<u32> = storage_client
            .fetch(&storage_address)
            .await?
            .ok_or_else(|| anyhow!("No storage value found"))?
            .to_value()?;
        Ok(value)
    }

    async fn call_inputless_runtime_api_method(
        &self,
        api_name: &str,
        method_name: &str,
    ) -> anyhow::Result<scale_value::Value<u32>> {
        let api_client = self.runtime_api().at_latest().await?;
        let value = api_client
            .call(subxt::runtime_api::dynamic(
                api_name,
                method_name,
                scale_value::Composite::Unnamed(vec![]),
            ))
            .await
            .map_err(|_| anyhow!("Runtime Api Call failed"))?
            .to_value()?;
        Ok(value)
    }
}
