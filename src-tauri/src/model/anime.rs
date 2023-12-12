use reqwest::Url;
use super::Episode;

pub struct Anime {
	pub name: String,
	pub link_to_series: Url,
	pub image_link: Url,
	pub title_kind: String,
	// Maybe use a decimal
	pub rating: Option<f32>,
	pub episode_count: u32,
	pub online_id: u32,
	pub description: Option<String>,
	pub genres: Option<Vec<String>>,
	pub episodes: Option<Vec<Box<Episode>>>,
}

impl std::hash::Hash for Anime {
	fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
		self.online_id.hash(state);
	}
}

impl std::cmp::PartialEq for Anime {
	#[inline]
	fn eq(&self, other: &Self) -> bool {
		self.online_id == other.online_id
	}
}

impl std::cmp::Eq for Anime {}
