use crate::serde_helper::deserialize_bytes_str;

//// IETF-like language code
#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Lang([u8; 2]);

impl From<Lang> for u16 {
	#[inline]
	fn from(value: Lang) -> Self {
		Self::from_be_bytes(value.0)
	}
}

impl Lang {
	pub const NULL: Lang = Lang([0; 2]);

	pub const fn from_letters(a: u8, b: u8) -> Option<Self> {
		match (a.to_ascii_lowercase(), b.to_ascii_lowercase()) {
			(a @ b'a'..=b'z', b @ b'a'..=b'z') => Some(Self([a, b])),
			_ => None
		}
	}
}

impl<'de> serde::Deserialize<'de> for Lang {
	fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
	where
		D: serde::Deserializer<'de>
	{
		deserialize_bytes_str(deserializer, |v| {
			match *v {
				[] => Some(Lang::NULL),
				[a, b] => Lang::from_letters(a, b),
				_ => None,
			}
		}, "IETF-formatted language code")
	}
}
