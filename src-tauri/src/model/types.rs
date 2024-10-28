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

	pub fn from_letters(a: u8, b: u8) -> Option<Self> {
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
		struct Visitor;

		impl<'de> serde::de::Visitor<'de> for Visitor {
			type Value = Lang;
		
			fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
				formatter.write_str("IETF-formatted language code")
			}

			fn visit_str<E: serde::de::Error>(self, v: &str) -> Result<Self::Value, E> {
				self.visit_bytes(v.as_bytes())
			}

			fn visit_char<E: serde::de::Error>(self, v: char) -> Result<Self::Value, E> {
				Err(serde::de::Error::invalid_type(serde::de::Unexpected::Char(v), &self))
			}

			fn visit_bytes<E: serde::de::Error>(self, v: &[u8]) -> Result<Self::Value, E> {
				match *v {
					[] => Some(Lang::NULL),
					[a, b] => Lang::from_letters(a, b),
					_ =>  None,
				}.ok_or_else(
					|| serde::de::Error::invalid_value(serde::de::Unexpected::Bytes(v), &self)
				)
			}
		}

		deserializer.deserialize_str(Visitor)
	}
}
