use super::PlayerEmbed;

pub struct Player {
	pub source: String,
	pub quality: Quality,
	pub audio_lang: Lang,
	pub subtitle_lang: Lang,
	pub embed: Option<PlayerEmbed>,
	/// Only used by the provider
	pub online_id: String,
}

pub type Lang = String;
pub type Quality = String;
