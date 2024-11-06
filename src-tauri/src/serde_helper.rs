use std::fmt::Formatter;
use std::fmt::Result as FmtResult;
use serde::{de::{Error as DeError, Unexpected, Visitor}, Deserializer};

pub fn deserialize_bytes_str<'de, 'ex, T, D, F>(deserializer: D, fun: F, expecting: &'ex str) -> Result<T, D::Error>
where
	D: Deserializer<'de>,
	F: FnOnce(&[u8]) -> Option<T>,
{
	struct Vis<'ex, F> { f: F, s: &'ex str }

	impl<'ex, 'de, T, F: FnOnce(&[u8]) -> Option<T>> Visitor<'de> for Vis<'ex, F> {
		type Value = T;
	
		fn expecting(&self, formatter: &mut Formatter) -> FmtResult {
			formatter.write_str(self.s)
		}

		fn visit_str<E: DeError>(self, v: &str) -> Result<Self::Value, E> {
			self.visit_bytes(v.as_bytes())
		}

		fn visit_char<E: DeError>(self, v: char) -> Result<Self::Value, E> {
			Err(DeError::invalid_type(Unexpected::Char(v), &self))
		}

		fn visit_bytes<E: DeError>(self, v: &[u8]) -> Result<Self::Value, E> {
			match (self.f)(v) {
				Some(val) => Ok(val),
				None => Err(DeError::invalid_value(Unexpected::Bytes(v), &self.s)),
			}
		}
	}

	deserializer.deserialize_str(Vis { f: fun, s: expecting })
}
