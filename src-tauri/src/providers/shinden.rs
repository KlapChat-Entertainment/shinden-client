use crate::model::{*, provider::*};
use super::utils::NodeRefExt;
use cookie::Cookie;
use reqwest::{Client as HttpClient, Url};
use tokio::sync::RwLock;
use std::sync::{Arc, OnceLock};

const SHINDEN_HOST: &str = "https://shinden.pl";

struct MutState {
	żeson_web_token: String,
	sess_shinden: String,
	auto_login: String,
}

pub struct ShindenProvider {
	mutable: RwLock<MutState>,

	shinden_url: Url,
	client: HttpClient,
}

#[inline]
fn string_set(string: &mut String, value: &str) {
	string.clear();
	string.push_str(value);
}

impl ShindenProvider {
	pub fn new() -> Self {
		let shinden_url = Url::parse(SHINDEN_HOST).unwrap();

		let client = HttpClient::builder()
			.https_only(true)
			.redirect(reqwest::redirect::Policy::none())
			.build().expect("Constructing HTTP client failed");

		Self {
			mutable: RwLock::new(MutState {
				żeson_web_token: String::new(),
				sess_shinden: String::new(),
				auto_login: String::new(),
			}),

			shinden_url,
			client,
		}
	}

	async fn fetch_url(&self, url: Url) -> reqwest::Result<String> {
		let mut headers = hyper::HeaderMap::from_iter(headers::FRONTEND.iter().map(|h| (h.name.clone(), h.value.clone())));
		let mut cookies = String::new();
		use std::fmt::Write;
		{
			let mutable = self.mutable.read().await;
			if !mutable.żeson_web_token.is_empty() {
				let _ = write!(cookies, "{};", Cookie::new("jwtCookie", &mutable.żeson_web_token));
			}
			if !mutable.sess_shinden.is_empty() {
				let _ = write!(cookies, "{};", Cookie::new("sess_shinden", &mutable.sess_shinden));
			}
		}
		if !cookies.is_empty() {
			headers.append(hyper::header::COOKIE, hyper::header::HeaderValue::try_from(cookies).unwrap());
		}

		let request = self.client.get(url)
			.headers(headers)
			.build()?;

		let response = self.client.execute(request).await?;
		for cookie in response.cookies() {
			match cookie.name() {
				"jwtCookie" => string_set(&mut self.mutable.write().await.żeson_web_token, cookie.value().into()),
				"sess_shinden" => string_set(&mut self.mutable.write().await.sess_shinden, cookie.value().into()),
				_ => {}
			}
		}

		response.text().await
	}

	fn parse_anime_from_html(&self, html: String) -> Result<AnimeSearchResult, AnimeSearchError> {
		macro_rules! select_one {
			($node:expr, $sel:expr) => {
				$node.select_first($sel).map_err(|_| FetchError::Parse(concat!("select one: ", stringify!($sel))))?
			};
		}
		macro_rules! select_multi {
			($node:expr, $sel:expr) => {
				$node.select($sel).map_err(|_| FetchError::Parse(concat!("select multi: ", stringify!($sel))))?
			};
		}

		let tree = tauri::utils::html::parse(html);
		let data_row = select_one!(tree, ".title-table > article");
		let mut anime = Vec::new();

		for row in data_row.as_node().children().filter(|child| child.has_class("div-row")) {
			let link = select_one!(row, ".desc-col > h3 > a");
			let name = link.text_contents();
			let link_to_series = {
				let link_attrs = link.attributes.borrow();
				let link_to_series = link_attrs.get("href").ok_or(FetchError::Parse("no href"))?;
				Url::options().base_url(Some(&self.shinden_url)).parse(&link_to_series).map_err(|_| FetchError::Parse("URL error"))?
			};

			let online_id = {
				let path = link_to_series.path();
				let name = match path.rsplit_once('/') {
					Some((_, name)) => name,
					None => path,
				};
				match name.split_once('-') {
					Some((id, _)) => id.parse().map_err(|_| FetchError::Parse("Invalid ID")),
					None => {
						println!("[WARN] ID did not have a dash");
						name.parse().map_err(|_| FetchError::Parse("Invalid ID"))
					}
				}
			}?;

			let image_link = {
				let cover_link = select_one!(row, ".cover-col > a");
				let cover_attrs = cover_link.attributes.borrow();
				let cover = cover_attrs.get("href").ok_or(FetchError::Parse("no href"))?;
				if cover.starts_with("javascript:") {
					println!("[WARN] Cover image contains JavaScript");
				}
				Url::options().base_url(Some(&self.shinden_url)).parse(cover).map_err(|_| FetchError::Parse("URL error 2 Electric Bogaloo"))?
			};

			let title_kind = select_one!(row, ".title-kind-col").text_contents();
			let episode_count: u32 = select_one!(row, ".episodes-col").text_contents().trim().parse().map_err(|_| FetchError::Parse("Ep count error"))?;
			let rating_raw = select_one!(row, ".rate-top").text_contents();
			let rating: Option<f32> = if rating_raw == "Brak" {
				None
			} else {
				match rating_raw.replace(',', ".").parse() {
					Ok(rating) => Some(rating),
					Err(_) => {
						//FetchError::Parse("Rating error")
						println!("[WARN] Couldn't parse rating: {}", rating_raw);
						None
					}
				}
			};

			anime.push(Anime {
				name,
				link_to_series,
				image_link,
				title_kind,
				rating,
				episode_count,
				online_id,
				description: OnceLock::new(),
				genres: OnceLock::new(),
				episodes: OnceLock::new(),
			});
		}
		Ok(anime)
	}

	fn parse_description_from_html(&self, html: String) -> Result<String, FetchError> {
		let tree = tauri::utils::html::parse(html);
		let desc = tree.select_first("#description").map_err(|_| FetchError::Parse("Couldn't find description node"))?;
		let pdesc = desc.as_node().select_first("p").map_err(|_| FetchError::Parse("Couldn't find paragraph in description"))?;
		let description = pdesc.text_contents();
		Ok(description)
	}
}

impl Provider for ShindenProvider {
	fn search_anime(self: Arc<Self>, name: &str, cb: Cb<AnimeSearchResult, AnimeSearchError>) {
		let mut url = self.shinden_url.join("/series").unwrap();
		url.query_pairs_mut().append_pair("search", name);
		tokio::spawn(async move {
			let response = self.fetch_url(url).await;
			match response {
				Ok(html) => {
					let res = self.parse_anime_from_html(html);
					match res {
						Ok(list) => cb(Ok(list)),
						Err(err) => cb(Err(err)),
					}
				}
				Err(err) => cb(Err(FetchError::Network(err))),
			}
		});
	}

	fn load_description(self: Arc<Self>, anime: Arc<Anime>, cb: Cb<(), FetchError>) {
		if anime.description.get().is_some() {
			cb(Ok(()));
			return;
		}

		tokio::spawn(async move {
			let response = self.fetch_url(anime.link_to_series.clone()).await;
			match response {
				Ok(html) => {
					let res = self.parse_description_from_html(html);
					match res {
						Ok(description) => {
							let _ = anime.description.set(description);
							cb(Ok(()));
						}
						Err(err) => cb(Err(err)),
					}
				}
				Err(err) => cb(Err(FetchError::Network(err))),
			}
		});
	}

	fn load_episode_list(self: Arc<Self>, anime: Arc<Anime>, cb: Cb<(), NetworkError>) {
		todo!()
	}

	fn load_players(self: Arc<Self>, episode: Arc<Episode>, cb: Cb<(), NetworkError>) {
		todo!()
	}

	fn get_player_embed(self: Arc<Self>, player: &Player, cb: Cb<PlayerEmbed, NetworkError>) {
		todo!()
	}
}

mod headers {
	use hyper::header::{HeaderName, HeaderValue};
	pub struct Header {
		pub name: HeaderName,
		pub value: HeaderValue,
	}

	// Polyfil for missing meta_var_expr on stable
	macro_rules! macro_meta_count {
		//($($t:tt)*) => (${count(t)});
		($($t:tt)*) => (__count_polyfil!(0, $($t)*));
	}
	macro_rules! __count_polyfil {
		($num:expr,) => ($num);
		($num:expr, $t:tt $($more:tt)*) => (__count_polyfil!($num+1, $($more)*));
	}
	macro_rules! headers {
		{$(
			const $const:ident = {
				$($header_name:literal: $header_value:literal,)*
			};
		)*} => {$(
			pub static $const: &[Header] = {
				static $const: [Header; macro_meta_count!($($header_name)*)] = [
					$(Header {
						name: HeaderName::from_static($header_name),
						value: HeaderValue::from_static($header_value),
					},)*
				];
				&$const
			};
		)*};
	}

	headers!{
		const FRONTEND = {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
			"cache-control": "max-age=0",
			"cookie": "cb-rodo=accepted;",
			"referer": "https://shinden.pl/",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-origin",
			"sec-fetch-user": "?1",
			"sec-gpc": "1",
			"upgrade-insecure-requests": "1",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
		};
		const API = {
			"host": "api4.shinden.pl",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
			"accept": "*/*",
			"accept-language": "pl,en-US;q=0.7,en;q=0.3",
			"origin": "https://shinden.pl",
			"connection": "keep-alive",
		};
		const LOGIN = {
			"content-type": "application/x-www-form-urlencoded",
			"accept-encoding": "gzip, deflate, br",
			"connection": "keep-alive",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51",
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
		};
	}
}
