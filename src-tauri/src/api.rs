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
	kind: &'static str,
	// Maybe use a decimal
	rating: Option<f32>,
	episode_count: u32,
	online_id: u32,
}

impl From<Arc<Anime>> for APIAnime {
	fn from(anime: Arc<Anime>) -> Self {
		unsafe { APIAnime {
			name: reborrow(&anime.name),
			link_to_series: reborrow(anime.link_to_series.as_str()),
			image_link: reborrow(anime.image_link.as_str()),
			kind: reborrow(&anime.title_kind),
			rating: anime.rating,
			episode_count: anime.episode_count,
			online_id: anime.online_id,
			_anime: anime,
		} }
	}
}

enum FutureState<T> {
	New,
	Pending(std::task::Waker),
	Finsihed(T),
	Taken,
}

struct StateWaiter<T> {
	state: Arc<Mutex<FutureState<T>>>,
}

impl<T> StateWaiter<T> {
	#[inline]
	const fn new(state: Arc<Mutex<FutureState<T>>>) -> Self {
		Self { state }
	}

	fn resolved(state: Arc<Mutex<FutureState<T>>>, value: T) -> Self {
		*state.lock().unwrap() = FutureState::Finsihed(value);
		Self { state }
	}
}

impl<T> Future for StateWaiter<T> {
	type Output = T;
	fn poll(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> Poll<Self::Output> {
		match *self.state.lock().unwrap() {
			ref mut state @ FutureState::New => {
				*state = FutureState::Pending(cx.waker().clone());
				Poll::Pending
			}
			FutureState::Pending(ref mut waker) => {
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
}

#[tauri::command(async)]
pub fn search_anime<'a>(api: State<'a, Arc<ApiState>>, anime: &str) -> impl Future<Output = Result<Vec<APIAnime>, APIError>> + Send + Sync {
	let api = Arc::clone(&api);
	let state = Arc::new(Mutex::new(FutureState::New));
	{
		let state = state.clone();
		let provider = match api.get_provider() {
			Ok(prov) => prov,
			Err(()) => return StateWaiter::resolved(state, Err(APIError::NoProvider)),
		};
		provider.search_anime(anime, Box::new(move |result| {
			let mut state = state.lock().unwrap();
			let result = match result {
				Ok(anime) => {
					let anime = {
						let mut cache = api.anime_cache.lock().unwrap();
						anime.into_iter()
							.map(|anime| cache.lookup_or_insert(anime))
							.map(APIAnime::from)
							.collect::<Vec<_>>()
					};
					Ok(anime)
				}
				Err(err) => Err(err.into()),
			};
			if let FutureState::Pending(waker) = std::mem::replace(&mut *state, FutureState::Finsihed(result)) {
				waker.wake();
			}
		}));
	}
	StateWaiter::new(state)
}
