use crate::{
	model::{*, provider::FetchError},
	providers::shinden::ShindenProvider,
	utils::reborrow,
};
use std::{
	sync::{Arc, Mutex},
	future::Future,
	task::Poll,
	borrow::Cow,
	collections::hash_map::RandomState,
	marker::PhantomData,
};
use indexmap::IndexSet;
use tauri::State;

type HashSet<K, H = RandomState> = hashbrown::HashMap<K, (), H>;

pub struct ApiState {
	provider: Option<Arc<dyn Provider + Send + Sync>>,
	anime_cache: Mutex<AnimeCache>,
}

trait APIStoreKey {
	fn get(cache: &mut AnimeCache) -> &mut APIStringStore;
}

macro_rules! api_store_key {
	{$(
		$name:ident => $store:ident ;
	)*} => {$(
		pub enum $name {}
		impl APIStoreKey for $name {
			#[inline(always)] fn get(cache: &mut AnimeCache) -> &mut APIStringStore { &mut cache.$store }
		}
	)*};
}

api_store_key! {
	SourcesStore => sources_store;
	QualityStore => quality_store;
	//LanguageStore => language_store;
}

#[derive(serde::Serialize)]
#[serde(transparent)]
struct APIStringKey<Set: APIStoreKey>(u32, PhantomData<fn() -> Set>);

type SourceKey = APIStringKey<SourcesStore>;
type QualityKey = APIStringKey<QualityStore>;
//type LangKey = APIStringKey<LanguageStore>;
/// Directly transmit as a number
type LangKey = u16;

struct APIStringStore {
	map: IndexSet<Box<str>>,
}

impl APIStringStore {
	fn new() -> Self {
		Self {
			map: IndexSet::new(),
		}
	}

	fn get_key(&mut self, key: &str) -> u32 {
		if let Some(idx) = self.map.get_index_of(key) {
			idx as u32
		} else {
			// This will technically leave the very last key value unused, but that's not a big deal
			if self.map.len() == u32::MAX as usize {
				panic!("String map reached its theoretical capacity!!");
			}
			self.map.insert_full(Box::from(key)).0 as u32
		}
	}

	fn get_from(&self, start: u32) -> impl Iterator<Item = &str> {
		self.map.as_slice()[start as usize..].iter().map(|x| &**x)
	}
}

pub struct AnimeCache {
	anime: HashSet<Arc<Anime>>,
	sources_store: APIStringStore,
	quality_store: APIStringStore,
	//language_store: APIStringStore,
}

impl AnimeCache {
	pub fn lookup_or_insert(&mut self, anime: Anime) -> Arc<Anime> {
		self.anime.raw_entry_mut()
			.from_key(&anime)
			.or_insert_with(|| (Arc::new(anime), ()))
			.0.clone()
	}

	pub fn get(&self, id: u32) -> Option<Arc<Anime>> {
		let hash = self.hash_id(id);

		self.anime.raw_entry()
			.from_hash(hash, |anime| anime.online_id == id)
			.map(|(anime, ())| anime.clone())
	}

	fn hash_id(&self, id: u32) -> u64 {
		use std::hash::{Hash, Hasher, BuildHasher};
		let mut hasher = self.anime.hasher().build_hasher();
		id.hash(&mut hasher);
		hasher.finish()
	}

	fn get_store_key<Set: APIStoreKey>(&mut self, key: &str) -> APIStringKey<Set> {
		let store = Set::get(self);
		APIStringKey(store.get_key(key), PhantomData)
	}
}

impl ApiState {
	pub fn create_default() -> Arc<Self> {
		Arc::new(ApiState {
			provider: Some(Arc::new(ShindenProvider::new())),
			anime_cache: Mutex::new(AnimeCache {
				anime: HashSet::with_hasher(RandomState::new()),
				sources_store: APIStringStore::new(),
				quality_store: APIStringStore::new(),
			}),
		})
	}

	pub fn get_provider(&self) -> Result<Arc<dyn Provider + Send + Sync>, ()> {
		self.provider.clone().ok_or(())
	}
}

#[derive(serde::Serialize)]
pub struct APIAnime {
	#[serde(skip)]
	_anime: Arc<Anime>,
	name: &'static str,
	link_to_series: &'static str,
	image_link: &'static str,
	description: Option<&'static str>,
	kind: &'static str,
	// Maybe use a decimal
	rating: Option<f32>,
	episode_count: u32,
	online_id: u32,
	#[serde(skip_serializing_if = "Option::is_none")]
	episode_list: Option<Vec<APIEpisode>>,
}

impl APIAnime {
	fn get_brief(anime: Arc<Anime>) -> Self {
		unsafe { APIAnime {
			name: reborrow(&anime.name),
			link_to_series: reborrow(anime.link_to_series.as_str()),
			image_link: reborrow(anime.image_link.as_str()),
			description: anime.description.get().map(|d| reborrow(&**d)),
			kind: reborrow(&anime.title_kind),
			rating: anime.rating,
			episode_count: anime.episode_count,
			online_id: anime.online_id,
			episode_list: None,
			_anime: anime,
		} }
	}

	fn get_detailed(anime: Arc<Anime>) -> Self {
		let episodes = anime.episodes.get().expect("Missing episode lists for details")
			.iter()
			.map(|ep| APIEpisode::get(ep.clone()))
			.collect();
		unsafe { APIAnime {
			name: reborrow(&anime.name),
			link_to_series: reborrow(anime.link_to_series.as_str()),
			image_link: reborrow(anime.image_link.as_str()),
			description: anime.description.get().map(|d| reborrow(&**d)),
			kind: reborrow(&anime.title_kind),
			rating: anime.rating,
			episode_count: anime.episode_count,
			online_id: anime.online_id,
			episode_list: Some(episodes),
			_anime: anime,
		} }
	}
}

#[derive(serde::Serialize)]
pub struct APIEpisode {
	#[serde(skip)]
	_episode: Arc<Episode>,
	name: &'static str,
	index: u32,
	link: &'static str,
	//online_id: u32,
	//#[serde(skip_serializing_if = "Option::is_none")]
	//players: Option<Vec<APIPlayer>>,
}

impl APIEpisode {
	fn get(episode: Arc<Episode>) -> Self {
		unsafe { APIEpisode {
			name: reborrow(&episode.name),
			index: episode.index,
			link: reborrow(episode.link.as_str()),
			//online_id: episode.online_id,
			_episode: episode,
		} }
	}
}

#[derive(serde::Serialize)]
pub struct APIPlayerInfo {
	source: SourceKey,
	quality: QualityKey,
	audio_lang: LangKey,
	subtitle_lang: LangKey,
	//link: &'static str,
}

impl APIPlayerInfo {
	fn get(api: &ApiState, player: &Player) -> Self {
		let mut cache = api.anime_cache.lock().unwrap();
		APIPlayerInfo {
			source: cache.get_store_key(&player.source),
			quality: cache.get_store_key(&player.quality),
			audio_lang: LangKey::from(player.audio_lang),
			subtitle_lang: LangKey::from(player.subtitle_lang),
		}
	}
}

/// **Warning**: it's unsafe to construct this without an embed inside `player`.
pub struct APIEmbed {
	player: Arc<Player>,
	_unsafe_validation_check: (),
}

impl APIEmbed {
	#[inline]
	pub fn from_player_check(player: &Arc<Player>) -> Option<Self> {
		if let Some(_) = player.embed.get() {
			Some(unsafe { Self::from_player_unchecked(player.clone()) })
		} else {
			None
		}
	}

	#[inline(always)]
	pub const unsafe fn from_player_unchecked(player: Arc<Player>) -> Self {
		Self { player, _unsafe_validation_check: () }
	}
}

impl serde::Serialize for APIEmbed {
	fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
		// Constructing means we have an embed
		unsafe {
			self.player.embed.get().unwrap_unchecked().serialize(serializer)
		}
	}
}

enum FutureState<T, State = ()> {
	NewState(State),
	Pending(std::task::Waker, State),
	Finsihed(T),
	Taken,
}

impl<T> FutureState<T> {
	#[allow(non_upper_case_globals)]
	pub const New: Self = Self::NewState(());
}

struct StateWaiter<T, State = ()> {
	state: Arc<Mutex<FutureState<T, State>>>,
}

impl<T, State> StateWaiter<T, State> {
	#[inline]
	const fn new(state: Arc<Mutex<FutureState<T, State>>>) -> Self {
		Self { state }
	}

	fn resolved(value: T) -> Self {
		let state = Arc::new(Mutex::new(FutureState::Finsihed(value)));
		Self { state }
	}
}

impl<T, State> Future for StateWaiter<T, State> {
	type Output = T;
	fn poll(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> Poll<Self::Output> {
		match *self.state.lock().unwrap() {
			ref mut state @ FutureState::NewState(_) => {
				let waker = cx.waker().clone();
				// SAFETY: We take out the value and immediately replace the variant.
				// There are no intermediate calls that could interfere here.
				unsafe {
					let value = match std::ptr::read(state) {
						FutureState::NewState(value) => value,
						// We are sure this is the variant
						_ => std::hint::unreachable_unchecked(),
					};
					std::ptr::write(state, FutureState::Pending(waker, value));
				}
				Poll::Pending
			}
			FutureState::Pending(ref mut waker, _) => {
				*waker = cx.waker().clone();
				Poll::Pending
			}
			ref mut state @ FutureState::Finsihed(_) => {
				let value = match std::mem::replace(state, FutureState::Taken) {
					FutureState::Finsihed(value) => value,
					// We are sure this is the variant
					_ => unsafe { std::hint::unreachable_unchecked() }
				};
				Poll::Ready(value)
			}
			FutureState::Taken => panic!("Future polled after it yielded ready"),
		}
	}
}

#[derive(serde::Serialize)]
pub struct APIError {
	kind: &'static str,
	msg: Cow<'static, str>,
}

impl From<FetchError> for APIError {
	fn from(err: FetchError) -> Self {
		match err {
			FetchError::Network(error) => Self {
				kind: "network",
				msg: error.to_string().into(),
			},
			FetchError::Parse(error) => Self {
				kind: "parse",
				msg: error.into(),
			},
			FetchError::Other(error) => Self {
				kind: "other",
				msg: error.into(),
			},
		}
	}
}

impl APIError {
	#[allow(non_upper_case_globals)]
	pub const NoProvider: Self = Self {
		kind: "no_provider",
		msg: Cow::Borrowed("no provider"),
	};

	#[inline(always)]
	pub fn unimplemented(msg: impl Into<Cow<'static, str>>) -> Self {
		Self {
			kind: "unimplemented",
			msg: msg.into(),
		}
	}

	#[inline(always)]
	pub fn request(msg: impl Into<Cow<'static, str>>) -> Self {
		Self {
			kind: "request",
			msg: msg.into(),
		}
	}
}

#[tauri::command(async)]
pub fn search_anime<'a>(api: State<'a, Arc<ApiState>>, anime: &str) -> impl Future<Output = Result<Vec<APIAnime>, APIError>> + Send + Sync {
	let api = Arc::clone(&api);
	let state;
	{
		let provider = match api.get_provider() {
			Ok(prov) => prov,
			Err(()) => return StateWaiter::resolved(Err(APIError::NoProvider)),
		};
		state = Arc::new(Mutex::new(FutureState::New));
		let state = state.clone();
		provider.search_anime(anime, Box::new(move |result| {
			let mut state = state.lock().unwrap();
			let result = match result {
				Ok(anime) => {
					let anime = {
						let mut cache = api.anime_cache.lock().unwrap();
						anime.into_iter()
							.map(|anime| cache.lookup_or_insert(anime))
							.map(APIAnime::get_brief)
							.collect::<Vec<_>>()
					};
					Ok(anime)
				}
				Err(err) => Err(err.into()),
			};
			if let FutureState::Pending(waker, ..) = std::mem::replace(&mut *state, FutureState::Finsihed(result)) {
				waker.wake();
			}
		}));
	}
	StateWaiter::new(state)
}

#[tauri::command(async)]
pub fn get_anime_details(api: State<'_, Arc<ApiState>>, online_id: u32) -> impl Future<Output = Result<APIAnime, APIError>> + Send + Sync {
	let anime = {
		let cache = api.anime_cache.lock().unwrap();
		cache.get(online_id)
	};
	if let Some(anime) = anime {
		// Maybe we have a cached answer
		if anime.description.get().is_some() && anime.episodes.get().is_some() {
			return StateWaiter::resolved(Ok(APIAnime::get_detailed(anime)));
		}

		let provider = match api.get_provider() {
			Ok(prov) => prov,
			Err(()) => return StateWaiter::resolved(Err(APIError::NoProvider)),
		};
		let state = Arc::new(Mutex::new(FutureState::NewState(0u8)));
		fn handle_response(result: Result<(), FetchError>, state: &Mutex<FutureState<Result<APIAnime, APIError>, u8>>, anime: Arc<Anime>, mask: u8) {
			let mut state = state.lock().unwrap();
			match result {
				Ok(()) => {}
				Err(err) => {
					if let FutureState::Pending(waker, ..) = std::mem::replace(&mut *state, FutureState::Finsihed(Err(err.into()))) {
						waker.wake();
						return;
					}
				}
			}
			let old = match *state {
				FutureState::NewState(v) => v,
				FutureState::Pending(_, v) => v,
				_ => return,
			};
			let new = old | mask;
			if new == 3 {
				let response = APIAnime::get_detailed(anime);
				if let FutureState::Pending(waker, ..) = std::mem::replace(&mut *state, FutureState::Finsihed(Ok(response))) {
					waker.wake();
				}
			} else {
				match *state {
					FutureState::NewState(ref mut v) => *v = new,
					FutureState::Pending(ref waker, ref mut v) => {
						*v = new;
						waker.wake_by_ref();
					}
					_ => unreachable!(),
				}
			}
		}
		{
			let state = state.clone();
			let provider = provider.clone();
			let anime = anime.clone();
			provider.load_description(anime.clone(), Box::new(move |result| {
				handle_response(result, &state, anime, 1);
			}));
		}
		{
			let state = state.clone();
			provider.load_episode_list(anime.clone(), Box::new(move |result| {
				handle_response(result, &state, anime, 2);
			}));
		}
		StateWaiter::new(state)
	} else {
		StateWaiter::resolved(Err(APIError::unimplemented("Anime is not loaded yet")))
	}
}

#[tauri::command(async)]
pub fn get_episode_player_list(api: State<'_, Arc<ApiState>>, anime_id: u32, episode_index: u32) -> impl Future<Output = Result<Vec<APIPlayerInfo>, APIError>> + Send + Sync {
	let anime = {
		let cache = api.anime_cache.lock().unwrap();
		let Some(anime) = cache.get(anime_id) else {
			return StateWaiter::resolved(Err(APIError::unimplemented("Anime is not loaded yet")));
		};
		anime
	};
	let Some(episodes) = anime.episodes.get() else {
		return StateWaiter::resolved(Err(APIError::unimplemented("Episodes are not loaded yet")));
	};

	let episode = match episodes.binary_search_by_key(&episode_index, |ep| ep.index) {
		Ok(episode) => &episodes[episode],
		Err(_) => return StateWaiter::resolved(Err(APIError::request("Episode with given index doesn't exist"))),
	};

	// Maybe we have a cached answer
	if let Some(players) = episode.players.get() {
		let players = players.iter()
			.map(|player| APIPlayerInfo::get(&api, player))
			.collect();
		return StateWaiter::resolved(Ok(players));
	}

	let provider = match api.get_provider() {
		Ok(prov) => prov,
		Err(()) => return StateWaiter::resolved(Err(APIError::NoProvider)),
	};
	let state = Arc::new(Mutex::new(FutureState::New));
	{
		let state = state.clone();
		let episode = episode.clone();
		let api = Arc::clone(&api);
		provider.load_players(episode.clone(), Box::new(move |result| {
			let mut state = state.lock().unwrap();
			let result = match result {
				Ok(()) => {
					let players = episode.players.get().unwrap()
						.iter()
						.map(|player| APIPlayerInfo::get(&api, player))
						.collect();
					Ok(players)
				}
				Err(err) => Err(err.into()),
			};
			if let FutureState::Pending(waker, ..) = std::mem::replace(&mut *state, FutureState::Finsihed(result)) {
				waker.wake();
			}
		}));
	}
	StateWaiter::new(state)
}

#[tauri::command(async)]
pub fn get_player_embed(api: State<'_, Arc<ApiState>>, anime_id: u32, episode_index: u32, player_index: u32) -> impl Future<Output = Result<APIEmbed, APIError>> + Send + Sync {
	let anime = {
		let cache = api.anime_cache.lock().unwrap();
		let Some(anime) = cache.get(anime_id) else {
			return StateWaiter::resolved(Err(APIError::unimplemented("Anime is not loaded yet")));
		};
		anime
	};
	let Some(episodes) = anime.episodes.get() else {
		return StateWaiter::resolved(Err(APIError::unimplemented("Episodes are not loaded yet")));
	};

	let episode = match episodes.binary_search_by_key(&episode_index, |ep| ep.index) {
		Ok(episode) => &episodes[episode],
		Err(_) => return StateWaiter::resolved(Err(APIError::request("Episode with given index doesn't exist"))),
	};

	let Some(players) = episode.players.get() else {
		return StateWaiter::resolved(Err(APIError::unimplemented("Players are not loaded yet")));
	};

	let Some(player) = players.get(player_index as usize) else {
		return StateWaiter::resolved(Err(APIError::request("Player index out of range")));
	};

	// Maybe we have a cached answer
	if let Some(embed) = APIEmbed::from_player_check(player) {
		return StateWaiter::resolved(Ok(embed));
	}

	let provider = match api.get_provider() {
		Ok(prov) => prov,
		Err(()) => return StateWaiter::resolved(Err(APIError::NoProvider)),
	};
	let state = Arc::new(Mutex::new(FutureState::New));
	{
		let state = state.clone();
		let player = player.clone();
		provider.get_player_embed(player.clone(), Box::new(move |result| {
			let mut state = state.lock().unwrap();
			let result = match result {
				Ok(()) => {
					assert!(player.embed.get().is_some());
					Ok(unsafe { APIEmbed::from_player_unchecked(player) })
				}
				Err(err) => Err(err.into()),
			};
			if let FutureState::Pending(waker, ..) = std::mem::replace(&mut *state, FutureState::Finsihed(result)) {
				waker.wake();
			}
		}));
	}
	StateWaiter::new(state)
}

#[tauri::command]
pub fn get_interned_strings(api: State<'_, Arc<ApiState>>, source_from: Option<u32>, quality_from: Option<u32>) -> serde_json::Value {
	use serde_json::{Value, Map};
	let mut result = Map::new();
	let cache = api.anime_cache.lock().unwrap();
	if let Some(source_from) = source_from {
		result.insert("source".into(), Value::Array(cache.sources_store.get_from(source_from).map(|s| Value::String(s.into())).collect()));
	}
	if let Some(quality_from) = quality_from {
		result.insert("quality".into(), Value::Array(cache.quality_store.get_from(quality_from).map(|s| Value::String(s.into())).collect()));
	}
	Value::Object(result)
}
