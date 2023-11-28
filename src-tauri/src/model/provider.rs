use super::{Anime, Episode, Player, PlayerEmbed};
pub use reqwest::Error as NetworkError;
use std::sync::Arc;

type Cb<T, E> = Box<dyn FnOnce(Result<T, E>) + Send + 'static>;

pub trait Provider {
	// Show API
	fn search_anime(self: Arc<Self>, name: &str, cb: Cb<AnimeSearchResult, AnimeSearchError>);
	fn load_description(self: Arc<Self>, anime: &mut Anime, cb: Cb<(), NetworkError>);
	fn load_episode_list(self: Arc<Self>, anime: &mut Anime, cb: Cb<(), NetworkError>);
	fn load_players(self: Arc<Self>, episode: &mut Episode, cb: Cb<(), NetworkError>);
	fn get_player_embed(self: Arc<Self>, player: &Player, cb: Cb<PlayerEmbed, NetworkError>);

	// Session API
	// TODO
}

pub enum FetchError {
	Network(NetworkError),
	Parse,
}

pub type AnimeSearchResult = Vec<Anime>;

pub type AnimeSearchError = FetchError;
