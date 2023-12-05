pub unsafe fn reborrow<'to, 'from, T: ?Sized>(reference: &'from T) -> &'to T {
	unsafe { &*(reference as *const _) }
}

pub unsafe fn reborrow_mut<'to, 'from, T: ?Sized>(reference: &'from mut T) -> &'to mut T {
	unsafe { &mut *(reference as *mut _) }
}
