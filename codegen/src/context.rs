use quote::format_ident;
use scale_typegen_description::scale_typegen::TypeGeneratorSettings;

#[derive(Debug, Clone)]
pub struct ExampleContext {
    pub dynamic: bool,
    pub inter_face_ident: syn::Ident,
    pub file_or_url: FileOrUrl,
    pub typegen_settings: TypeGeneratorSettings,
}

impl ExampleContext {
    pub fn from_file(file_path: &str, dynamic: bool) -> Self {
        ExampleContext {
            dynamic,
            inter_face_ident: format_ident!("runtime"),
            file_or_url: FileOrUrl::File(file_path.into()),
            typegen_settings: subxt_codegen::default_subxt_type_gen_settings(),
        }
    }

    pub fn from_url(url: &str, dynamic: bool) -> Self {
        ExampleContext {
            dynamic,
            inter_face_ident: format_ident!("runtime"),
            file_or_url: FileOrUrl::Url(url.into()),
            typegen_settings: subxt_codegen::default_subxt_type_gen_settings(),
        }
    }
}

#[derive(Debug, Clone)]
pub enum FileOrUrl {
    File(String),
    Url(String),
}
