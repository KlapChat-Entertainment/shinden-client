use tauri::utils::html::NodeRef;

pub trait NodeRefExt {
	fn has_class(&self, class: &str) -> bool;
}

impl NodeRefExt for NodeRef {
	fn has_class(&self, class: &str) -> bool {
		let Some(element) = self.as_element() else { return false };
		let attrs = element.attributes.borrow();
		let Some(cls) = attrs.get("class") else { return false };
		cls.split(' ').any(|cls| *cls == *class)
	}
}
