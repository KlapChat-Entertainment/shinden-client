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
};
use tauri::State;

type HashSet<K, H = RandomState> = hashbrown::HashMap<K, (), H>;

pub struct ApiState {
	provider: Option<Arc<dyn Provider + Send + Sync>>,
	anime_cache: Mutex<AnimeCache>,
}

pub struct AnimeCache {
	anime: HashSet<Arc<Anime>>,
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
}

impl ApiState {
	pub fn create_default() -> Arc<Self> {
		Arc::new(ApiState {
			provider: Some(Arc::new(ShindenProvider::new())),
			anime_cache: Mutex::new(AnimeCache {
				anime: HashSet::with_hasher(RandomState::new()),
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
			ref state @ FutureState::NewState(ref value) => {
				// SAFETY SAFETY SAFETY SAFETY SAFETY SAFETY SAFETY SAFETY:
				// This is safe, since the value is immediately rewritten.
				let state: *const _ = state;
				unsafe {
					std::ptr::write(state.cast_mut(), FutureState::Pending(cx.waker().clone(), std::ptr::read(value)));
				}
				Poll::Pending
			}
			FutureState::Pending(ref mut waker, _) => {
				*waker = cx.waker().clone();
				Poll::Pending
			}
			ref state @ FutureState::Finsihed(ref value) => {
				// SAFETY SAFETY SAFETY SAFETY SAFETY SAFETY SAFETY SAFETY:
				// This is safe, since the value is immediately rewritten.
				let state: *const _ = state;
				let result = Poll::Ready(unsafe { std::ptr::read(value) });
				unsafe { std::ptr::write(state.cast_mut(), FutureState::Taken); }
				result
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
	let api = Arc::clone(&api);
	let cache = api.anime_cache.lock().unwrap();
	if let Some(anime) = cache.get(online_id) {
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
