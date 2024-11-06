#[derive(serde::Serialize)]
pub struct PlayerEmbed {
	pub raw_html: Box<str>,
	pub embed_src: Option<Box<str>>,
	pub direct_link: Option<Box<str>>,
}
