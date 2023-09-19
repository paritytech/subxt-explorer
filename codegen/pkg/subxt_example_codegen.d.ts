/* tslint:disable */
/* eslint-disable */
/**
*/
export class Client {
  free(): void;
/**
* Creates an offline client from the metadata bytes and the name of the metadata file.
*
* genesis_hash and runtime_version are set to some unimportant default values and hopefully not used.
* @param {string} metadata_file_name
* @param {Uint8Array} bytes
* @returns {Client}
*/
  static fromBytes(metadata_file_name: string, bytes: Uint8Array): Client;
/**
* Creates an OnlineClient from a given url
* @param {string} url
* @returns {Promise<Client>}
*/
  static fromUrl(url: string): Promise<Client>;
/**
* @returns {any}
*/
  metadataContent(): any;
/**
* @param {string} pallet_name
* @returns {any}
*/
  palletDocs(pallet_name: string): any;
/**
* @param {string} pallet_name
* @returns {any}
*/
  palletContent(pallet_name: string): any;
/**
* @param {string} pallet_name
* @param {string} call_name
* @returns {any}
*/
  callContent(pallet_name: string, call_name: string): any;
/**
* @param {string} pallet_name
* @param {string} entry_name
* @returns {any}
*/
  storageEntryContent(pallet_name: string, entry_name: string): any;
/**
* @param {string} pallet_name
* @param {string} constant_name
* @returns {any}
*/
  constantContent(pallet_name: string, constant_name: string): any;
/**
* @param {string} runtime_api_trait_name
* @returns {any}
*/
  runtimeApiTraitDocs(runtime_api_trait_name: string): any;
/**
* @param {string} runtime_api_trait_name
* @returns {any}
*/
  runtimeApiTraitContent(runtime_api_trait_name: string): any;
/**
* @param {string} runtime_api_trait_name
* @param {string} method_name
* @returns {any}
*/
  runtimeApiMethodContent(runtime_api_trait_name: string, method_name: string): any;
/**
* Dynamically fetches the value of a keyless storage entry.
* Only works if this is an online client.
* @param {string} pallet_name
* @param {string} entry_name
* @returns {Promise<any>}
*/
  fetchKeylessStorageValue(pallet_name: string, entry_name: string): Promise<any>;
}
