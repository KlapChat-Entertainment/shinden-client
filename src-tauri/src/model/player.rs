use std::{any::Any, sync::OnceLock};

use super::{PlayerEmbed, types::Lang};

pub struct Player {
	pub source: String,
	pub quality: Quality,
	pub audio_lang: Lang,
	pub subtitle_lang: Lang,
	pub embed: OnceLock<PlayerEmbed>,
	pub provider_data: Option<Box<dyn Any + Send + Sync>>,
}

pub type Quality = String;
