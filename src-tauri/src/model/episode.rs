use std::sync::{Arc, OnceLock};
use reqwest::Url;
use super::Player;

pub struct Episode {
	pub name: String,
	pub index: u32,
	pub link: Url,
	pub players: OnceLock<Vec<Arc<Player>>>,
}
