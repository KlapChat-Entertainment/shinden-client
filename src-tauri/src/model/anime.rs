use reqwest::Url;
use super::Episode;

pub struct Anime {
	pub name: String,
	pub link_to_series: Url,
	pub image_link: Url,
	pub title_kind: String,
	// Maybe use a decimal
	pub rating: f32,
	pub episode_count: u32,
	pub description: Option<String>,
	pub genres: Option<Vec<String>>,
	pub episodes: Option<Vec<Box<Episode>>>,
}

impl std::hash::Hash for Anime {
	fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
		self.name.hash(state);
	}
}

impl std::cmp::PartialEq for Anime {
	#[inline]
	fn eq(&self, other: &Self) -> bool {
		// Maybe use link_to_series instead?
		self.name == other.name
	}
}

impl std::cmp::Eq for Anime {}
