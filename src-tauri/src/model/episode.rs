use hyper::Uri;
use super::Player;

pub struct Episode {
	pub name: String,
	pub link: Uri,
	pub players: Option<Vec<Box<Player>>>,
}
