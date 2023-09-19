use quote::format_ident;

#[derive(Debug, Clone)]
pub struct ExampleContext {
    pub dynamic: bool,
    pub inter_face_ident: syn::Ident,
    pub file_or_url: FileOrUrl,
}

impl ExampleContext {
    pub fn from_file(file_path: &str, dynamic: bool) -> Self {
        ExampleContext {
            dynamic,
            inter_face_ident: format_ident!("runtime"),
            file_or_url: FileOrUrl::File(file_path.into()),
        }
    }

    pub fn from_url(url: &str, dynamic: bool) -> Self {
        ExampleContext {
            dynamic,
            inter_face_ident: format_ident!("runtime"),
            file_or_url: FileOrUrl::Url(url.into()),
        }
    }
}

#[derive(Debug, Clone)]
pub enum FileOrUrl {
    File(String),
    Url(String),
}
