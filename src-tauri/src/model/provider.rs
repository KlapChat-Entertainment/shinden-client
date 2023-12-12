use super::{Anime, Episode, Player, PlayerEmbed};
pub use reqwest::Error as NetworkError;
use std::sync::Arc;

pub type Cb<T, E> = Box<dyn FnOnce(Result<T, E>) + Send + 'static>;

pub trait Provider {
	// Content API
	fn search_anime(self: Arc<Self>, name: &str, cb: Cb<AnimeSearchResult, AnimeSearchError>);
	fn load_description(self: Arc<Self>, anime: Arc<Anime>, cb: Cb<(), FetchError>);
	fn load_episode_list(self: Arc<Self>, anime: Arc<Anime>, cb: Cb<(), NetworkError>);
	fn load_players(self: Arc<Self>, episode: Arc<Episode>, cb: Cb<(), NetworkError>);
	fn get_player_embed(self: Arc<Self>, player: &Player, cb: Cb<PlayerEmbed, NetworkError>);

	// Session API
	// TODO
}

#[derive(Debug)]
pub enum FetchError {
	Network(NetworkError),
	Parse(&'static str),
}

impl std::fmt::Display for FetchError {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		match self {
			Self::Network(network) => network.fmt(f),
			Self::Parse(str) => write!(f, "failed to parse response: {str}"),
		}
	}
}

impl std::error::Error for FetchError {
	fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
		match self {
			Self::Network(error) => Some(error),
			Self::Parse{..} => None,
		}
	}
}

pub type AnimeSearchResult = Vec<Anime>;

pub type AnimeSearchError = FetchError;
