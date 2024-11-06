#[derive(serde::Serialize)]
pub struct PlayerEmbed {
	#[serde(rename = "original")]
	pub raw_html: Box<str>,
	#[serde(rename = "embed")]
	pub embed_src: Option<Box<str>>,
	pub direct_link: Option<Box<str>>,
}
