use reqwest::Url;
use super::Episode;

pub struct Anime {
	pub name: String,
	pub link_to_series: Url,
	pub image_link: Url,
	pub genre: String,
	// Maybe use a decimal
	pub rating: f32,
	pub episode_count: u32,
	pub episodes: Option<Vec<Box<Episode>>>,
	pub description: Option<String>,
}
